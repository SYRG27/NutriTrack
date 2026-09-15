"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { PLAN } from "@/lib/plan";
import {
  FAVES, FOODS, defaultQty, findFoods, foodByName, macrosFor, perUnit, plural, stepOf,
} from "@/lib/foods";
import { TARGET, type Entry, type Food, type PlanSlot, type WeighIn } from "@/lib/types";
import {
  amountOf, dayKey, h12, hm, nowHM, parseKey, planIdOf, shiftKey, totalsFor,
} from "@/lib/day";
import Dial from "./Dial";
import WeekPlan from "./WeekPlan";
import Trends from "./Trends";

type Tab = "today" | "week" | "trends";
const TODAY = () => dayKey(new Date());
const HISTORY_DAYS = 35;

export default function NutriTrack({ canEstimate }: { canEstimate: boolean }) {
  const supabase = useMemo(() => createClient(), []);

  const [tab, setTab] = useState<Tab>("today");
  const [key, setKey] = useState(TODAY);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [weighIns, setWeighIns] = useState<WeighIn[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");

  // search / quantity panel
  const [q, setQ] = useState("");
  const [pick, setPick] = useState<Food | null>(null);
  const [qty, setQty] = useState(1);
  const [when, setWhen] = useState("");
  const [thinking, setThinking] = useState(false);

  const say = useCallback((m: string) => {
    setToast(m);
    setTimeout(() => setToast(""), 1400);
  }, []);

  /* ---------- load ---------- */
  useEffect(() => {
    let alive = true;
    (async () => {
      const since = shiftKey(TODAY(), -HISTORY_DAYS);
      const [e, w] = await Promise.all([
        supabase.from("entries").select("*").gte("eaten_on", since).order("eaten_at"),
        supabase.from("weigh_ins").select("measured_on, lb").order("measured_on"),
      ]);
      if (!alive) return;
      if (e.data) setEntries(e.data as Entry[]);
      if (w.data) setWeighIns(w.data as WeighIn[]);
      setLoading(false);
    })();
    return () => { alive = false; };
  }, [supabase]);

  const entriesByDay = useMemo(() => {
    const m = new Map<string, Entry[]>();
    entries.forEach((e) => {
      const list = m.get(e.eaten_on) ?? [];
      list.push(e);
      m.set(e.eaten_on, list);
    });
    return m;
  }, [entries]);

  const dayEntries = entriesByDay.get(key) ?? [];
  const totals = totalsFor(dayEntries);

  /* ---------- writes ---------- */
  const addEntry = useCallback(
    async (row: Omit<Entry, "id">) => {
      const { data, error } = await supabase.from("entries").insert(row).select().single();
      if (error) return say("Could not save that — check your connection");
      setEntries((prev) => [...prev, data as Entry]);
    },
    [supabase, say],
  );

  const removeEntry = useCallback(
    async (id: string) => {
      const before = entries;
      setEntries((prev) => prev.filter((x) => x.id !== id));
      const { error } = await supabase.from("entries").delete().eq("id", id);
      if (error) { setEntries(before); say("Could not remove that"); }
    },
    [entries, supabase, say],
  );

  const patchEntry = useCallback(
    async (id: string, patch: Partial<Entry>) => {
      const before = entries;
      setEntries((prev) => prev.map((x) => (x.id === id ? { ...x, ...patch } : x)));
      const { error } = await supabase.from("entries").update(patch).eq("id", id);
      if (error) { setEntries(before); say("Could not update that"); }
    },
    [entries, supabase, say],
  );

  const addFood = useCallback(
    (f: Food, amount: number, at: string) => {
      const m = macrosFor(f, amount);
      return addEntry({
        eaten_on: key, eaten_at: at || nowHM(),
        name: f.n, emoji: f.e, qty: amount, unit: f.u, per_g: f.g,
        unit_kcal: f.k, unit_protein: f.p,
        kcal: Math.round(m.k), protein: Math.round(m.p * 10) / 10,
        plan_id: null,
      });
    },
    [addEntry, key],
  );

  const togglePlanned = useCallback(
    (slot: PlanSlot, item: { n: string; k: number; p: number; e: string }) => {
      const pid = planIdOf(slot.id, item.n);
      const hit = dayEntries.find((x) => x.plan_id === pid);
      if (hit) return removeEntry(hit.id);
      return addEntry({
        eaten_on: key, eaten_at: key === TODAY() ? nowHM() : slot.time,
        name: item.n, emoji: item.e, qty: null, unit: null, per_g: false,
        unit_kcal: null, unit_protein: null,
        kcal: item.k, protein: item.p, plan_id: pid,
      });
    },
    [dayEntries, addEntry, removeEntry, key],
  );

  const bump = useCallback(
    (e: Entry, dir: number) => {
      if (e.qty == null || e.unit_kcal == null || e.unit_protein == null) return;
      const step = e.per_g ? 25 : 1;
      const next = Math.round((Number(e.qty) + dir * step) * 100) / 100;
      if (next <= 0) return removeEntry(e.id);
      const k = e.per_g ? (Number(e.unit_kcal) * next) / 100 : Number(e.unit_kcal) * next;
      const p = e.per_g ? (Number(e.unit_protein) * next) / 100 : Number(e.unit_protein) * next;
      return patchEntry(e.id, {
        qty: next, kcal: Math.round(k), protein: Math.round(p * 10) / 10,
      });
    },
    [patchEntry, removeEntry],
  );

  const saveWeight = useCallback(
    async (lb: number) => {
      const measured_on = TODAY();
      const { error } = await supabase
        .from("weigh_ins").upsert({ measured_on, lb }, { onConflict: "user_id,measured_on" });
      if (error) return say("Could not save your weight");
      setWeighIns((prev) => {
        const rest = prev.filter((w) => w.measured_on !== measured_on);
        return [...rest, { measured_on, lb }].sort((a, b) => a.measured_on.localeCompare(b.measured_on));
      });
      say("Weight saved");
    },
    [supabase, say],
  );

  async function estimate() {
    const food = q.trim();
    if (!food || thinking) return;
    setThinking(true);
    try {
      const res = await fetch("/api/estimate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ food }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "estimate failed");
      const f: Food = {
        n: String(data.name || food).slice(0, 60),
        e: String(data.emoji || "🍽️").slice(0, 4),
        u: String(data.unit || "serving").slice(0, 12),
        k: Math.max(0, Number(data.kcal) || 0),
        p: Math.max(0, Number(data.protein) || 0),
        g: String(data.unit) === "g",
        a: "",
      };
      setPick(f); setQty(defaultQty(f)); setWhen(nowHM());
      say("Estimated — adjust the amount, then save");
    } catch (err) {
      say(err instanceof Error ? err.message : "Could not estimate");
    } finally {
      setThinking(false);
    }
  }

  /* ---------- today ---------- */
  const plan = PLAN[parseKey(key).getDay()];
  const own = dayEntries.filter((e) => !e.plan_id);

  const blocks: { t: string; o: number; node: React.ReactNode }[] = [];
  if (plan.gym)
    blocks.push({
      t: plan.gym.from, o: 1,
      node: (
        <div className="slot" key="gym">
          <div className="gymbar">
            <span style={{ fontSize: 18 }}>🏋️</span>
            <span className="g1">Gym</span>
            <span className="g2">{h12(plan.gym.from)} – {h12(plan.gym.to)}</span>
          </div>
        </div>
      ),
    });

  plan.slots.forEach((slot) => {
    const pk = slot.items.reduce((a, i) => a + i.k, 0);
    const pp = slot.items.reduce((a, i) => a + i.p, 0);
    blocks.push({
      t: slot.time, o: 0,
      node: (
        <div className="slot" key={slot.id}>
          <div className="slothead">
            <span className="slottime">{h12(slot.time)}</span>
            <span className="slotname">{slot.name}</span>
            <span className="slotmeta">{pk} kcal · {pp}g</span>
          </div>
          <div className="items">
            {slot.items.map((it) => {
              const logged = dayEntries.find((x) => x.plan_id === planIdOf(slot.id, it.n));
              return (
                <button
                  key={it.n}
                  className={`item${logged ? " done" : ""}`}
                  onClick={() => { togglePlanned(slot, it); say(logged ? "Unticked" : "Logged"); }}
                >
                  <span className="tile" style={{ background: `var(--${slot.tone}-soft)` }}>{it.e}</span>
                  <span className="iname">
                    {it.n}
                    <span className="imac">
                      <span><b>{it.k}</b> kcal</span>
                      <span><b>{it.p}</b>g protein</span>
                    </span>
                  </span>
                  {logged && <span className="atime mono">{h12(logged.eaten_at)}</span>}
                  <span className="tick">✓</span>
                </button>
              );
            })}
          </div>
        </div>
      ),
    });
  });

  own.forEach((e) => {
    blocks.push({
      t: hm(e.eaten_at), o: 2,
      node: (
        <div className="slot" key={e.id}>
          <div className="items">
            <div className="item own">
              <span className="tile" style={{ background: "var(--plum-soft)" }}>{e.emoji ?? "🍽️"}</span>
              <span className="iname">
                {e.name}
                <span className="imac">
                  <span><b>{Math.round(e.kcal)}</b> kcal</span>
                  <span><b>{Math.round(e.protein * 10) / 10}</b>g protein</span>
                  {e.qty != null && <span>{amountOf(e)}</span>}
                </span>
              </span>
              <button className="x" onClick={() => removeEntry(e.id)} aria-label={`Remove ${e.name}`}>×</button>
              <div className="ownfoot">
                <span className="oflag">you added</span>
                <input
                  className="t" type="time" value={hm(e.eaten_at)}
                  aria-label={`Time for ${e.name}`}
                  onChange={(ev) => ev.target.value && patchEntry(e.id, { eaten_at: ev.target.value })}
                />
                {e.qty != null && (
                  <span className="q" style={{ marginLeft: "auto" }}>
                    <button onClick={() => bump(e, -1)} aria-label="Less">−</button>
                    <span className="qn">{amountOf(e)}</span>
                    <button onClick={() => bump(e, 1)} aria-label="More">+</button>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      ),
    });
  });

  blocks.sort((a, b) => (a.t === b.t ? a.o - b.o : a.t.localeCompare(b.t)));

  const matches = findFoods(q);
  const sorted = [...dayEntries].sort((a, b) => a.eaten_at.localeCompare(b.eaten_at));
  const kcalLeft = Math.round(TARGET.kcal - totals.kcal);
  const protLeft = Math.round(TARGET.protein - totals.protein);

  return (
    <div className="wrap">
      <header>
        <div className="hrow">
          <div className="brand">Nutri<span>Track</span></div>
          <div className="datenav">
            <button onClick={() => setKey((k) => shiftKey(k, -1))} aria-label="Previous day">‹</button>
            <div className="datelabel">
              {key === TODAY()
                ? "Today"
                : parseKey(key).toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" })}
            </div>
            <button
              onClick={() => setKey((k) => (shiftKey(k, 1) > TODAY() ? k : shiftKey(k, 1)))}
              aria-label="Next day"
            >›</button>
          </div>
        </div>

        <div className="dials">
          <Dial
            label="Calories" value={String(Math.round(totals.kcal))}
            sub={kcalLeft >= 0 ? `${kcalLeft} left` : `${Math.abs(kcalLeft)} over`}
            frac={totals.kcal / TARGET.kcal}
            color={totals.kcal > TARGET.kcal + 120 ? "var(--chilli)" : "var(--leaf)"}
          />
          <Dial
            label="Protein" value={`${Math.round(totals.protein)}g`}
            sub={protLeft > 0 ? `${protLeft}g to go` : "target hit ✓"}
            frac={totals.protein / TARGET.protein} color="var(--turmeric)"
          />
        </div>

        <nav className="tabs">
          {(["today", "week", "trends"] as Tab[]).map((t) => (
            <button key={t} aria-current={tab === t} onClick={() => { setTab(t); window.scrollTo({ top: 0 }); }}>
              {t === "today" ? "Today" : t === "week" ? "Week plan" : "Trends"}
            </button>
          ))}
        </nav>
      </header>

      <main>
        {loading ? (
          <div className="loading">Loading your log…</div>
        ) : tab === "week" ? (
          <WeekPlan />
        ) : tab === "trends" ? (
          <Trends entriesByDay={entriesByDay} weighIns={weighIns} onSaveWeight={saveWeight} />
        ) : (
          <>
            <div className="slot" style={{ paddingTop: 2 }}>
              <div className="slothead" style={{ paddingBottom: 2 }}>
                <span className="slotname">{plan.label}</span>
                <span className="daytag">{plan.focus}</span>
              </div>
            </div>

            {blocks.map((b) => b.node)}

            <div className="section">
              <div className="sechead">Ate something else?</div>
              <div className="secsub">
                Type the food, say how much and when — NutriTrack works out the calories and drops it into your day.
              </div>

              <div className="card" style={{ padding: "12px 12px 10px" }}>
                <input
                  id="q" type="search" autoComplete="off"
                  placeholder="banana, black coffee, chicken curry…"
                  value={q}
                  onChange={(e) => { setQ(e.target.value); setPick(null); }}
                />

                {q.trim() !== "" && matches.length > 0 && (
                  <div className="reslist">
                    {matches.map((f) => (
                      <button key={f.n} className="fres"
                              onClick={() => { setPick(f); setQty(defaultQty(f)); setWhen(nowHM()); }}>
                        <span className="fe">{f.e}</span>
                        <span className="fn">{f.n}</span>
                        <span className="fu">{perUnit(f)}</span>
                      </button>
                    ))}
                  </div>
                )}

                {q.trim() !== "" && matches.length === 0 && (
                  <div className="reslist" style={{ padding: "10px 4px" }}>
                    <div className="empty" style={{ padding: 0 }}>
                      Not in the list — NutriTrack can work it out for you.
                    </div>
                    {canEstimate && (
                      <button className="aibtn" disabled={thinking} onClick={estimate}>
                        {thinking ? "Working it out…" : `✨ Estimate “${q.trim()}”`}
                      </button>
                    )}
                    <details className="manual">
                      <summary>Or enter the numbers yourself</summary>
                      <form
                        className="form" style={{ boxShadow: "none" }}
                        onSubmit={(ev) => {
                          ev.preventDefault();
                          const form = ev.currentTarget;
                          const k = Number((form.elements.namedItem("cK") as HTMLInputElement).value);
                          const p = Number((form.elements.namedItem("cP") as HTMLInputElement).value);
                          if (!Number.isFinite(k) || !Number.isFinite(p)) return;
                          const name = q.trim();
                          setQ("");
                          addEntry({
                            eaten_on: key, eaten_at: nowHM(), name, emoji: "🍽️",
                            qty: null, unit: null, per_g: false, unit_kcal: null, unit_protein: null,
                            kcal: k, protein: p, plan_id: null,
                          });
                          say(`Added ${name}`);
                        }}
                      >
                        <div className="row">
                          <div style={{ flex: 1 }}>
                            <label htmlFor="cK">Calories</label>
                            <input id="cK" name="cK" className="mono" type="number" inputMode="numeric" min="0" placeholder="450" required />
                          </div>
                          <div style={{ flex: 1 }}>
                            <label htmlFor="cP">Protein (g)</label>
                            <input id="cP" name="cP" className="mono" type="number" inputMode="numeric" min="0" placeholder="30" required />
                          </div>
                        </div>
                        <button className="save" type="submit">Add “{q.trim()}”</button>
                      </form>
                    </details>
                  </div>
                )}

                {pick && (
                  <div className="qpanel">
                    <div className="qhead"><span className="e">{pick.e}</span>{pick.n}</div>
                    <div className="qrow">
                      <button aria-label="Less"
                              onClick={() => setQty((v) => Math.max(pick.g ? 25 : 0.5,
                                Math.round((v - stepOf(pick)) * 100) / 100))}>−</button>
                      <input
                        className="mono" type="number" inputMode="decimal"
                        step={stepOf(pick)} min="0" value={qty} aria-label="How much"
                        onChange={(e) => {
                          const v = parseFloat(e.target.value);
                          if (Number.isFinite(v) && v > 0) setQty(v);
                        }}
                      />
                      <span className="qu">{pick.g ? "grams" : plural(pick.u, qty)}</span>
                      <button aria-label="More"
                              onClick={() => setQty((v) => Math.round((v + stepOf(pick)) * 100) / 100)}>+</button>
                    </div>
                    <div className="qtot">
                      {Math.round(macrosFor(pick, qty).k)} kcal ·{" "}
                      {Math.round(macrosFor(pick, qty).p * 10) / 10}g protein
                    </div>
                    <div className="qtime">
                      <label htmlFor="qwhen">What time?</label>
                      <input id="qwhen" type="time" value={when} onChange={(e) => setWhen(e.target.value)} />
                    </div>
                    <button
                      className="save"
                      onClick={() => {
                        const f = pick, amount = qty, at = when || nowHM();
                        setPick(null); setQ(""); setWhen("");
                        addFood(f, amount, at);
                        say(`${f.n} saved at ${h12(at)}`);
                      }}
                    >Save to my day</button>
                  </div>
                )}
              </div>

              <div className="secsub" style={{ margin: "14px 0 8px" }}>
                Quick add — one tap is one serving, now
              </div>
              <div className="chips">
                {FAVES.map((n) => {
                  const f = foodByName(n);
                  if (!f) return null;
                  return (
                    <button key={n} className="chip"
                            onClick={() => { addFood(f, defaultQty(f), nowHM()); say(`Added ${f.n}`); }}>
                      {f.e} {f.n.replace(/ \(.*\)/, "")}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="section">
              <div className="sechead">Today’s log</div>
              <div className="secsub">
                {sorted.length} item{sorted.length === 1 ? "" : "s"} eaten, in order
              </div>
              <div className="card">
                {sorted.length ? (
                  sorted.map((e) => (
                    <div className="logrow" key={e.id}>
                      <span className="t">{h12(e.eaten_at)}</span>
                      <span style={{ fontSize: 17 }}>{e.emoji ?? "🍽️"}</span>
                      <span className="n">
                        {e.name}
                        {e.qty != null && (
                          <>
                            <br />
                            <span style={{ fontSize: 11.5, color: "var(--muted)" }}>{amountOf(e)}</span>
                          </>
                        )}
                      </span>
                      <span className="m">{Math.round(e.kcal)} · {Math.round(e.protein)}g</span>
                      <button className="x" onClick={() => removeEntry(e.id)} aria-label={`Remove ${e.name}`}>×</button>
                    </div>
                  ))
                ) : (
                  <div className="empty">Nothing logged yet. Tick items above as you eat them.</div>
                )}
              </div>
              {own.length > 0 && (
                <div className="note">
                  {own.length} off-plan item{own.length === 1 ? "" : "s"} today — that’s fine as long as
                  the ring above stays near 2,350.
                </div>
              )}
              <div style={{ padding: "18px 0 0", textAlign: "center" }}>
                <button className="signout" onClick={async () => {
                  await supabase.auth.signOut();
                  window.location.href = "/login";
                }}>Sign out</button>
              </div>
            </div>
          </>
        )}
      </main>

      <div className={`sync${toast ? " on" : ""}`}>{toast}</div>
    </div>
  );
}
