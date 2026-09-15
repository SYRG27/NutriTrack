"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { buildPlan, itemKcal, itemLabel, itemProtein, slotTotals } from "@/lib/plan";
import { targetsFor, showWeight, type Profile } from "@/lib/profile";
import Logo from "./Logo";
import {
  FAVES, FOODS, defaultQty, findFoods, foodByName, macrosFor, perUnit, plural, stepOf,
} from "@/lib/foods";
import type { Entry, Food, PlanItem, PlanSlot, WeighIn } from "@/lib/types";
import {
  amountOf, dayKey, h12, hm, nowHM, parseKey, planIdOf, shiftKey, totalsFor,
} from "@/lib/day";
import Dial from "./Dial";
import WeekPlan from "./WeekPlan";
import Trends from "./Trends";

type Tab = "today" | "week" | "trends";
const TODAY = () => dayKey(new Date());
const HISTORY_DAYS = 35;

export default function NutriTrack({
  canEstimate,
  email,
  profile,
}: {
  canEstimate: boolean;
  email: string;
  profile: Profile;
}) {
  const supabase = useMemo(() => createClient(), []);
  const PLAN = useMemo(() => buildPlan(profile), [profile]);
  const TARGET = useMemo(() => targetsFor(profile), [profile]);

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
  const [drafts, setDrafts] = useState<Record<string, { time: string; qty: number }>>({});

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
    (slot: PlanSlot, item: PlanItem) => {
      const pid = planIdOf(slot.id, item.n);
      const hit = dayEntries.find((x) => x.plan_id === pid);
      if (hit) return removeEntry(hit.id);
      return addEntry({
        eaten_on: key, eaten_at: key === TODAY() ? nowHM() : slot.time,
        name: itemLabel(item), emoji: item.e, qty: null, unit: null, per_g: false,
        unit_kcal: null, unit_protein: null,
        kcal: Math.round(itemKcal(item)), protein: Math.round(itemProtein(item) * 10) / 10,
        plan_id: pid,
      });
    },
    [dayEntries, addEntry, removeEntry, key],
  );

  /* Edits are held as a draft until you press Save, so changing a time doesn't
     make the card jump between meals halfway through typing it. */
  const draftOf = (e: Entry) => drafts[e.id] ?? { time: hm(e.eaten_at), qty: Number(e.qty ?? 0) };
  const isDirty = (e: Entry) => {
    const d = drafts[e.id];
    return !!d && (d.time !== hm(e.eaten_at) || d.qty !== Number(e.qty ?? 0));
  };
  const setDraft = (e: Entry, patch: Partial<{ time: string; qty: number }>) =>
    setDrafts((prev) => ({ ...prev, [e.id]: { ...draftOf(e), ...patch } }));

  const saveDraft = useCallback(
    async (e: Entry) => {
      const d = drafts[e.id];
      if (!d) return;
      const patch: Partial<Entry> = { eaten_at: d.time };
      if (e.qty != null && e.unit_kcal != null && e.unit_protein != null) {
        const k = e.per_g ? (Number(e.unit_kcal) * d.qty) / 100 : Number(e.unit_kcal) * d.qty;
        const p = e.per_g ? (Number(e.unit_protein) * d.qty) / 100 : Number(e.unit_protein) * d.qty;
        patch.qty = d.qty;
        patch.kcal = Math.round(k);
        patch.protein = Math.round(p * 10) / 10;
      }
      await patchEntry(e.id, patch);
      setDrafts((prev) => {
        const next = { ...prev };
        delete next[e.id];
        return next;
      });
      say(`Saved to ${h12(d.time)}`);
    },
    [drafts, patchEntry, say],
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

  /* Renaming a meal in plan.ts orphans anything already ticked against the old
     name. Show those as your own entries rather than letting them count toward
     the rings while being invisible. */
  const planIds = new Set(
    plan.slots.flatMap((s) => s.items.map((i) => planIdOf(s.id, i.n))),
  );
  const own = dayEntries.filter((e) => !e.plan_id || !planIds.has(e.plan_id));

  /* Anything you logged yourself joins the meal whose time it sits closest to,
     so a banana at 12:39 lands in Lunch rather than floating between meals. */
  const minutes = (t: string) => {
    const [h, m] = hm(t).split(":").map(Number);
    return h * 60 + m;
  };
  const ownBySlot = new Map<string, Entry[]>();
  own.forEach((e) => {
    let best = plan.slots[0];
    let bestGap = Infinity;
    plan.slots.forEach((s) => {
      const gap = Math.abs(minutes(s.time) - minutes(e.eaten_at));
      if (gap < bestGap) {
        bestGap = gap;
        best = s;
      }
    });
    ownBySlot.set(best.id, [...(ownBySlot.get(best.id) ?? []), e]);
  });

  function ownCard(e: Entry) {
    const d = draftOf(e);
    const changed = isDirty(e);
    const step = e.per_g ? 25 : 1;
    const shown = e.per_g
      ? `${Math.round(d.qty)} g`
      : `${d.qty % 1 ? d.qty : Math.round(d.qty)} ${plural(e.unit ?? "serving", d.qty)}`;

    return (
      <div className="item own" key={e.id}>
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
            className="t" type="time" value={d.time} aria-label={`Time for ${e.name}`}
            onChange={(ev) => ev.target.value && setDraft(e, { time: ev.target.value })}
          />
          {e.qty != null && (
            <span className="q">
              <button
                aria-label="Less"
                onClick={() => setDraft(e, { qty: Math.max(step, Math.round((d.qty - step) * 100) / 100) })}
              >−</button>
              <span className="qn">{shown}</span>
              <button
                aria-label="More"
                onClick={() => setDraft(e, { qty: Math.round((d.qty + step) * 100) / 100 })}
              >+</button>
            </span>
          )}
          <button
            className={`savesm${changed ? " on" : ""}`}
            disabled={!changed}
            onClick={() => saveDraft(e)}
          >
            {changed ? "Save" : "Saved"}
          </button>
        </div>
      </div>
    );
  }

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
    const { kcal: pk, protein: pp } = slotTotals(slot);
    const mine = (ownBySlot.get(slot.id) ?? []).sort((a, b) => a.eaten_at.localeCompare(b.eaten_at));

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
                    {it.alt ? `or ${itemLabel(it)}` : itemLabel(it)}
                    <span className="imac">
                      <span><b>{Math.round(itemKcal(it))}</b> kcal</span>
                      <span><b>{Math.round(itemProtein(it))}</b>g protein</span>
                    </span>
                  </span>
                  {logged && <span className="atime mono">{h12(logged.eaten_at)}</span>}
                  <span className="tick">✓</span>
                </button>
              );
            })}
            {mine.map((e) => ownCard(e))}
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
          <Logo size={26} />
          <a className="iconbtn" href="/setup" title="Edit your details" aria-label="Edit your details">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9c.14.63.67 1.1 1.31 1.1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </a>
          <button
            className="iconbtn"
            title={`Sign out of ${email}`}
            aria-label={`Sign out of ${email}`}
            onClick={async () => {
              await supabase.auth.signOut();
              window.location.href = "/login";
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
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
          <WeekPlan plan={PLAN} profile={profile} />
        ) : tab === "trends" ? (
          <Trends entriesByDay={entriesByDay} weighIns={weighIns}
                  onSaveWeight={saveWeight} profile={profile} />
        ) : (
          <>
            <div className="slot" style={{ paddingTop: 2 }}>
              <div className="slothead" style={{ paddingBottom: 2 }}>
                <span className="slotname">{plan.label}</span>
                <span className="daytag">{plan.focus}</span>
              </div>
            </div>

            <div className="todaygrid">
            <div className="colmain">{blocks.map((b) => b.node)}</div>
            <div className="colside">

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
              <div className="whoami">
                {profile.name ? `${profile.name} · ` : ""}{email} ·{" "}
                <a href="/setup" style={{ color: "var(--leaf)" }}>edit my details</a>
              </div>
            </div>
            </div>
            </div>
          </>
        )}
      </main>

      <div className={`sync${toast ? " on" : ""}`}>{toast}</div>
    </div>
  );
}
