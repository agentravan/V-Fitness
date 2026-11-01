"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, CircleDollarSign, Clock, CreditCard, Minus, PackagePlus, Plus, Receipt, Search, ShoppingBag, Trash2, Wallet } from "lucide-react";

import { useStore } from "./store";
import { Btn, Kpi, Panel, Pill, aed } from "./ui";
import { statusOf, type OrderItem, type OrderStatus, type PaymentMethod, type ProductCategory } from "@/lib/demo-data";

const CATS: ("All" | ProductCategory)[] = ["All", "Protein", "Supplements", "Drinks", "Snacks", "Gear"];

export function Orders() {
  const { data, today, createOrder, setOrderStatus, restock } = useStore();
  const [cat, setCat] = useState<"All" | ProductCategory>("All");
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [customerQ, setCustomerQ] = useState("");
  const [customer, setCustomer] = useState<{ id: string | null; name: string }>({ id: null, name: "Walk-in guest" });
  const [payment, setPayment] = useState<PaymentMethod>("Card");
  const [statusF, setStatusF] = useState<"All" | OrderStatus>("All");

  const start = today.getTime();
  const todayOrders = data.orders.filter((o) => o.at >= start);
  const sales = todayOrders.reduce((s, o) => s + o.total, 0);
  const pending = data.orders.filter((o) => o.status === "Pending");
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1).getTime();
  const monthSales = data.orders.filter((o) => o.at >= monthStart).reduce((s, o) => s + o.total, 0);

  const productById = useMemo(() => new Map(data.products.map((p) => [p.id, p])), [data.products]);
  const products = data.products.filter((p) => cat === "All" || p.category === cat);
  const total = cart.reduce((s, it) => s + it.qty * it.price, 0);

  const members = useMemo(() => {
    const t = customerQ.trim().toLowerCase();
    if (t.length < 2) return [];
    return data.members.filter((m) => statusOf(m, today) !== "Expired" && (m.name.toLowerCase().includes(t) || m.id.toLowerCase().includes(t))).slice(0, 5);
  }, [customerQ, data.members, today]);

  const add = (id: string) => {
    const p = productById.get(id);
    if (!p || p.stock <= 0) return;
    setCart((c) => {
      const ex = c.find((x) => x.productId === id);
      if (ex) return ex.qty >= p.stock ? c : c.map((x) => (x.productId === id ? { ...x, qty: x.qty + 1 } : x));
      return [...c, { productId: id, qty: 1, price: p.price }];
    });
  };
  const dec = (id: string) => setCart((c) => c.flatMap((x) => (x.productId === id ? (x.qty > 1 ? [{ ...x, qty: x.qty - 1 }] : []) : [x])));

  const checkout = () => {
    if (!cart.length) return;
    createOrder({ memberId: customer.id, customer: customer.name, items: cart, payment: customer.id ? payment : payment === "Member account" ? "Card" : payment });
    setCart([]);
    setCustomer({ id: null, name: "Walk-in guest" });
    setCustomerQ("");
  };

  const list = data.orders.filter((o) => statusF === "All" || o.status === statusF).slice(0, 40);
  const lowStock = data.products.filter((p) => p.stock <= p.reorderAt);

  return (
    <div className="space-y-5">
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4" aria-label="Order metrics">
        <Kpi icon={ShoppingBag} label="Sales today" value={aed(sales)} hint={`${todayOrders.length} orders`} tone="amber" />
        <Kpi icon={Receipt} label="Avg order value" value={aed(todayOrders.length ? sales / todayOrders.length : 0)} tone="sky" />
        <Kpi icon={Clock} label="Pending on account" value={aed(pending.reduce((s, o) => s + o.total, 0))} hint={`${pending.length} orders to collect`} tone="rose" />
        <Kpi icon={CircleDollarSign} label="Shop sales this month" value={aed(monthSales)} tone="emerald" />
      </section>

      <div className="grid gap-5 xl:grid-cols-[1.4fr_1fr]">
        <Panel title="Protein bar & pro shop" sub="Tap a product to add it to the order">
          <div className="mb-4 flex flex-wrap gap-2" role="tablist" aria-label="Category">
            {CATS.map((c) => (
              <button key={c} role="tab" aria-selected={cat === c} onClick={() => setCat(c)} className={`rounded-lg px-3 py-1.5 text-xs font-medium ${cat === c ? "bg-brand text-black" : "border border-white/10 text-white/60 hover:text-white"}`}>
                {c}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {products.map((p) => {
              const inCart = cart.find((x) => x.productId === p.id)?.qty ?? 0;
              const low = p.stock <= p.reorderAt;
              return (
                <button
                  key={p.id}
                  onClick={() => add(p.id)}
                  disabled={p.stock <= 0}
                  className={`relative rounded-xl border p-3 text-left transition-colors disabled:opacity-40 ${inCart ? "border-brand bg-brand/[0.08]" : "border-white/[0.08] bg-black hover:border-white/25"}`}
                >
                  {inCart > 0 && <span className="absolute right-2 top-2 grid h-6 min-w-6 place-items-center rounded-full bg-brand px-1.5 text-xs font-bold text-black">{inCart}</span>}
                  <p className="text-[11px] uppercase tracking-wide text-white/40">{p.category}</p>
                  <p className="mt-1 pr-6 text-sm font-medium leading-tight text-white">{p.name}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-sm font-semibold text-brand">AED {p.price}</span>
                    <span className={`text-[11px] ${low ? "text-amber-300" : "text-white/40"}`}>{p.stock} in stock</span>
                  </div>
                </button>
              );
            })}
          </div>
        </Panel>

        <Panel title="New order" sub="Charge now or add to the member's account">
          <div>
            <p className="mb-1.5 text-xs font-medium text-white/55">Customer</p>
            {customer.id ? (
              <div className="flex items-center justify-between rounded-lg border border-brand/40 bg-brand/[0.06] px-3 py-2 text-sm">
                <span className="text-white">{customer.name} <span className="text-white/45">· {customer.id}</span></span>
                <button onClick={() => setCustomer({ id: null, name: "Walk-in guest" })} className="text-xs text-white/50 hover:text-white">Change</button>
              </div>
            ) : (
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" aria-hidden />
                <input value={customerQ} onChange={(e) => setCustomerQ(e.target.value)} placeholder="Find member (or leave as walk-in)" className="field !pl-9" aria-label="Find member" />
                {members.length > 0 && (
                  <ul className="absolute inset-x-0 top-full z-10 mt-1 overflow-hidden rounded-lg border border-white/10 bg-[#141416]">
                    {members.map((m) => (
                      <li key={m.id}>
                        <button onClick={() => { setCustomer({ id: m.id, name: m.name }); setCustomerQ(""); setPayment("Member account"); }} className="w-full px-3 py-2 text-left text-sm text-white/85 hover:bg-white/5">
                          {m.name} <span className="text-white/40">· {m.id}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          <ul className="mt-4 min-h-[120px] divide-y divide-white/[0.06] rounded-xl border border-white/[0.07] bg-black">
            {cart.map((it) => {
              const p = productById.get(it.productId)!;
              return (
                <li key={it.productId} className="flex items-center gap-3 px-3 py-2.5 text-sm">
                  <span className="min-w-0 flex-1 truncate text-white/85">{p.name}</span>
                  <div className="flex items-center gap-1">
                    <button onClick={() => dec(it.productId)} className="grid h-7 w-7 place-items-center rounded-md border border-white/10 text-white/70 hover:text-white" aria-label={`Remove one ${p.name}`}>
                      {it.qty === 1 ? <Trash2 className="h-3.5 w-3.5" /> : <Minus className="h-3.5 w-3.5" />}
                    </button>
                    <span className="w-6 text-center tabular-nums">{it.qty}</span>
                    <button onClick={() => add(it.productId)} className="grid h-7 w-7 place-items-center rounded-md border border-white/10 text-white/70 hover:text-white" aria-label={`Add one ${p.name}`}>
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <span className="w-20 text-right tabular-nums text-white">{aed(it.qty * it.price)}</span>
                </li>
              );
            })}
            {!cart.length && <li className="grid h-[118px] place-items-center text-sm text-white/40">Cart is empty</li>}
          </ul>

          <p className="mb-1.5 mt-4 text-xs font-medium text-white/55">Payment</p>
          <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Payment method">
            {([["Card", CreditCard], ["Cash", Wallet], ["Member account", Receipt]] as const).map(([pm, Icon]) => {
              const disabled = pm === "Member account" && !customer.id;
              return (
                <button
                  key={pm}
                  role="radio"
                  aria-checked={payment === pm}
                  disabled={disabled}
                  onClick={() => setPayment(pm)}
                  className={`flex flex-col items-center gap-1 rounded-lg border px-2 py-2.5 text-xs font-medium disabled:opacity-30 ${payment === pm ? "border-brand bg-brand/10 text-white" : "border-white/10 text-white/55 hover:text-white"}`}
                >
                  <Icon className="h-4 w-4" aria-hidden /> {pm === "Member account" ? "On account" : pm}
                </button>
              );
            })}
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-white/[0.07] pt-4">
            <span className="text-sm text-white/55">Total</span>
            <span className="text-2xl font-semibold tabular-nums">{aed(total)}</span>
          </div>
          <Btn tone="primary" className="mt-3 w-full !py-3 !text-sm" disabled={!cart.length} onClick={checkout}>
            {payment === "Member account" && customer.id ? "Add to member account" : `Charge ${aed(total)}`}
          </Btn>
        </Panel>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.6fr_1fr]">
        <Panel
          title="Orders"
          sub="Latest 40"
          action={
            <div role="radiogroup" aria-label="Filter orders" className="inline-flex rounded-lg border border-white/10 bg-black p-0.5 text-xs">
              {(["All", "Pending", "Paid", "Collected"] as const).map((s) => (
                <button key={s} role="radio" aria-checked={statusF === s} onClick={() => setStatusF(s)} className={`rounded-md px-2.5 py-1.5 font-medium ${statusF === s ? "bg-white/10 text-white" : "text-white/45 hover:text-white"}`}>{s}</button>
              ))}
            </div>
          }
        >
          <div className="-mx-5 max-h-[460px] overflow-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="sticky top-0 bg-[#0c0c0d] text-xs text-white/40">
                <tr>
                  <th scope="col" className="px-5 py-2 font-medium">Order</th>
                  <th scope="col" className="px-3 py-2 font-medium">Customer</th>
                  <th scope="col" className="px-3 py-2 font-medium">Items</th>
                  <th scope="col" className="px-3 py-2 font-medium">Total</th>
                  <th scope="col" className="px-5 py-2 text-right font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05]">
                {list.map((o) => (
                  <tr key={o.id} className="hover:bg-white/[0.02]">
                    <td className="px-5 py-2.5">
                      <p className="font-medium text-white">{o.id}</p>
                      <p className="text-xs text-white/40">{new Date(o.at).toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</p>
                    </td>
                    <td className="px-3 py-2.5 text-white/75">{o.customer}</td>
                    <td className="max-w-[220px] px-3 py-2.5 text-white/55">
                      <span className="line-clamp-2">{o.items.map((it) => `${it.qty}× ${productById.get(it.productId)?.name ?? it.productId}`).join(", ")}</span>
                    </td>
                    <td className="px-3 py-2.5">
                      <p className="tabular-nums text-white">{aed(o.total)}</p>
                      <p className="text-xs text-white/40">{o.payment}</p>
                    </td>
                    <td className="px-5 py-2.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Pill tone={o.status === "Pending" ? "amber" : o.status === "Paid" ? "brand" : "slate"}>{o.status}</Pill>
                        {o.status === "Pending" && <Btn onClick={() => setOrderStatus(o.id, "Paid")}>Mark paid</Btn>}
                        {o.status === "Paid" && <Btn onClick={() => setOrderStatus(o.id, "Collected")}>Collected</Btn>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel title="Inventory" sub={lowStock.length ? `${lowStock.length} products at or below reorder level` : "All products well stocked"}>
          <ul className="space-y-2.5">
            {[...data.products].sort((a, b) => a.stock / a.reorderAt - b.stock / b.reorderAt).map((p) => {
              const low = p.stock <= p.reorderAt;
              return (
                <li key={p.id} className="flex items-center gap-3 text-sm">
                  <span className="min-w-0 flex-1 truncate text-white/80">{p.name}</span>
                  <span className={`flex items-center gap-1 tabular-nums ${low ? "text-amber-300" : "text-white/50"}`}>
                    {low && <AlertTriangle className="h-3.5 w-3.5" aria-hidden />}
                    {p.stock}
                  </span>
                  <Btn onClick={() => restock(p.id, 20)} title="Add 20 units"><PackagePlus className="h-3.5 w-3.5" aria-hidden /> +20</Btn>
                </li>
              );
            })}
          </ul>
        </Panel>
      </div>
    </div>
  );
}
