import test from "node:test";
import assert from "node:assert/strict";
import { calculateOrderTotals, totalsForOrder } from "../src/data/orderTotals.js";
import { createManualProduct, readManualProducts, saveManualProducts } from "../src/data/manualProducts.js";
import { createDirectPurchase } from "../src/data/directPurchase.js";
import retailPoints from "../src/data/retailPoints.js";
import { canUse } from "../src/access/policy.js";

const baseProduct = { id: 7, shades: [{ id:"Rojo" }, { id:"Nude" }] };

test("comprar ahora selecciona una sola variante y no modifica el carrito original", () => {
  const cart = [{ productId: 2, shadeId: "Rosa", quantity: 3 }];
  const before = JSON.stringify(cart);
  assert.deepEqual(createDirectPurchase(baseProduct,"Nude"), [{ productId: 7,shadeId:"Nude",quantity:1 }]);
  assert.equal(JSON.stringify(cart), before);
  assert.equal(createDirectPurchase(baseProduct,"No existe"),null);
  assert.equal(createDirectPurchase({...baseProduct,manual:true},"Rojo"),null);
});

test("IVA, ahorro y envío respetan el umbral estricto superior a $200.000", () => {
  const a = calculateOrderTotals([{unitPrice:200000,oldPrice:220000,quantity:1}],"immediate");
  assert.equal(a.productsTotal,200000);
  assert.equal(a.shipping,4500);
  assert.equal(a.savings,20000);
  assert.equal(a.iva + a.base, a.productsTotal);
  assert.equal(a.total,204500);
  assert.equal(calculateOrderTotals([{unitPrice:200001,oldPrice:220000,quantity:1}],"cycle").shipping,0);
  assert.equal(calculateOrderTotals([{unitPrice:45000,oldPrice:50000,quantity:2}],"pickup").shipping,0);
});

test("comprobante consulta los mismos totales guardados por el checkout", () => {
  const totals = calculateOrderTotals([{unitPrice:60000,oldPrice:70000,quantity:2}],"immediate");
  assert.deepEqual(totalsForOrder({ totals, cart:[],totalPrice:totals.total }),totals);
});

test("registro personal crea producto independiente y puede persistirse", () => {
  const p = createManualProduct({name:"Mi labial",brand:"Marca propia",category:"Labios",shade:"Rosa",quantity:"2",minStock:"1",provider:"Tienda propia",description:"Color mate"});
  assert.ok(p && p.manual);
  assert.equal(p.inventoryEntry.quantity,2);
  assert.equal(p.shades[0].name,"Rosa");
  assert.equal(createManualProduct({name:"",brand:"X",shade:"Rosa",quantity:1,minStock:1}),null);
  const local = new Map();
  const storage = {setItem:(k,v)=>local.set(k,v),getItem:k=>local.get(k)??null};
  assert.equal(saveManualProducts(storage,[p]),true);
  assert.equal(readManualProducts(storage)[0].name,"Mi labial");
});

test("direct buy existe en el modo app y los 50 puntos tienen direcciones diferenciadas", () => {
  assert.equal(canUse("store","buyNow"),true);
  assert.equal(canUse("product-detail","buyNow"),true);
  assert.equal(retailPoints.length,50);
  assert.equal(new Set(retailPoints.map(p=>p.id)).size,50);
  assert.ok(retailPoints.every(p=>p.address.includes("Bogotá") && p.retailerUrl));
});
