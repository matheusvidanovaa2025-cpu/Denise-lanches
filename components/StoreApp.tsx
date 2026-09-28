'use client';
import {useEffect,useMemo,useState} from "react";
import {Search,ShoppingBag,MessageCircle,Home,Plus,Minus,X,Send,Settings,Pencil,Trash2,ChevronRight} from "lucide-react";
import {supabase} from "@/lib/supabase";
import {categories as demoCategories,products as demoProducts} from "@/lib/demo";

const money=(n:number)=>n.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
type Product={id:string;name:string;description:string;price:number;category_id:string;category:string;icon:string};
type CartItem=Product&{quantity:number};

export default function StoreApp(){
 const [products,setProducts]=useState<Product[]>(demoProducts as Product[]);
 const [categories,setCategories]=useState(demoCategories);
 const [cat,setCat]=useState("todos"),[q,setQ]=useState("");
 const [cart,setCart]=useState<CartItem[]>([]);
 const [modal,setModal]=useState<"cart"|"checkout"|"support"|"admin"|"product"|null>(null);
 const [selected,setSelected]=useState<Product|null>(null);
 const [admin,setAdmin]=useState<Product|null>(null);
 const [toast,setToast]=useState("");
 const [msg,setMsg]=useState(""),[messages,setMessages]=useState(["Olá! 👋 Como podemos ajudar?"]);
 const [customer,setCustomer]=useState({name:"",phone:"",address:"",notes:"",payment:"PIX"});

 useEffect(()=>{try{const x=localStorage.getItem("denise-cart");if(x)setCart(JSON.parse(x))}catch{};load()},[]);
 useEffect(()=>localStorage.setItem("denise-cart",JSON.stringify(cart)),[cart]);

 async function load(){
  if(!supabase)return;
  const c=await supabase.from("categories").select("*").eq("active",true).order("sort_order");
  const p=await supabase.from("products").select("*").eq("active",true);
  if(!c.error&&c.data?.length)setCategories([{id:"todos",name:"Todos",icon:"✦"},...c.data.map((x:any)=>({...x,id:x.id.toString()}))]);
  if(!p.error&&p.data?.length){
   const map=new Map((c.data||[]).map((x:any)=>[x.id,x.name]));
   setProducts(p.data.map((x:any)=>({...x,category:map.get(x.category_id)||"Lanches"})));
  }
 }
 const filtered=useMemo(()=>products.filter(p=>(cat==="todos"||p.category_id===cat)&&(!q||(`${p.name} ${p.description}`).toLowerCase().includes(q.toLowerCase()))),[products,cat,q]);
 const count=cart.reduce((s,x)=>s+x.quantity,0),total=cart.reduce((s,x)=>s+x.price*x.quantity,0);
 function add(p:Product){setCart(c=>{const x=c.find(i=>i.id===p.id);return x?c.map(i=>i.id===p.id?{...i,quantity:i.quantity+1}:i):[...c,{...p,quantity:1}]});setToast("Adicionado ao carrinho");setTimeout(()=>setToast(""),1400)}
 function qty(id:string,d:number){setCart(c=>c.flatMap(x=>x.id===id?[{...x,quantity:x.quantity+d}].filter(y=>y.quantity>0):[x]))}
 async function order(){
  if(!customer.name||!customer.phone||!customer.address){setToast("Preencha nome, telefone e endereço");setTimeout(()=>setToast(""),1800);return}
  if(supabase){
   const o=await supabase.from("orders").insert({customer_name:customer.name,phone:customer.phone,address:customer.address,notes:customer.notes,payment_method:customer.payment,total}).select().single();
   if(!o.error&&o.data)await supabase.from("order_items").insert(cart.map(x=>({order_id:o.data.id,product_id:x.id,quantity:x.quantity,unit_price:x.price})));
  }
  setCart([]);setModal(null);setToast("Pedido enviado para a loja!");setTimeout(()=>setToast(""),2000);
 }

 return <div className="app">
  <header className="top"><div className="brand"><b>DL</b><span>Denise Lanches<small>Cardápio online</small></span></div><div className="actions"><button onClick={()=>setModal("support")}><MessageCircle/></button><button onClick={()=>setModal("cart")}><ShoppingBag/>{count>0&&<i>{count}</i>}</button></div></header>
  <main>
   <section className="hero"><div><label>SEU LANCHE, DO SEU JEITO</label><h1>O sabor da Denise chegou até você.</h1><p>Escolha seus favoritos, monte seu pedido e acompanhe tudo direto pelo cardápio online.</p><em>● Pedidos online disponíveis</em></div></section>
   <div className="search"><Search/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Buscar lanche, bebida, combo..."/></div>
   <div className="heading"><h2>Categorias</h2><span>{products.length} itens</span></div>
   <div className="cats">{categories.map(c=><button className={cat===c.id?"active":""} onClick={()=>setCat(c.id)} key={c.id}>{c.icon} {c.name}</button>)}</div>
   <div className="heading"><h2>{cat==="todos"?"Mais pedidos":categories.find(x=>x.id===cat)?.name}</h2><span>{filtered.length} resultados</span></div>
   <section className="grid">{filtered.map(p=><article className="card" key={p.id} onClick={()=>{setSelected(p);setModal("product")}}>
    <div className="food"><small>{p.category}</small><strong>{p.icon}</strong></div><div className="body"><h3>{p.name}</h3><p>{p.description}</p><footer><b>{money(p.price)}</b><button onClick={e=>{e.stopPropagation();add(p)}}><Plus/></button></footer></div>
   </article>)}</section>
   <p className="footer">Denise Lanches • {supabase?"Supabase conectado":"modo demonstração local"}</p>
  </main>
  <nav className="nav"><button className="sel"><Home/><small>Início</small></button><button onClick={()=>setModal("support")}><MessageCircle/><small>Suporte</small></button><button onClick={()=>setModal("cart")}><ShoppingBag/><small>Carrinho {count?`(${count})`:""}</small></button><button onClick={()=>setModal("admin")}><Settings/><small>Admin</small></button></nav>

  {modal==="product"&&selected&&<div className="back"><div className="sheet"><div className="title"><h2>{selected.name}</h2><button onClick={()=>setModal(null)}><X/></button></div><div className="food big"><strong>{selected.icon}</strong></div><p className="muted">{selected.description}</p><div className="total"><span>Preço</span><b>{money(selected.price)}</b></div><button className="primary" onClick={()=>{add(selected);setModal("cart")}}>Adicionar ao carrinho</button></div></div>}

  {modal==="cart"&&<div className="back"><div className="sheet"><div className="title"><h2>Seu carrinho</h2><button onClick={()=>setModal(null)}><X/></button></div>{!cart.length?<div className="empty">Seu carrinho está vazio.</div>:<>{cart.map(x=><div className="row" key={x.id}><span className="mini">{x.icon}</span><div className="grow"><b>{x.name}</b><small>{money(x.price)}</small></div><div className="qty"><button onClick={()=>qty(x.id,-1)}><Minus/></button><b>{x.quantity}</b><button onClick={()=>qty(x.id,1)}><Plus/></button></div></div>)}<div className="total"><span>Total</span><b>{money(total)}</b></div><button className="primary" onClick={()=>setModal("checkout")}>Continuar para checkout <ChevronRight/></button></>}</div></div>}

  {modal==="checkout"&&<div className="back"><div className="sheet"><div className="title"><h2>Finalizar pedido</h2><button onClick={()=>setModal(null)}><X/></button></div><Form customer={customer} setCustomer={setCustomer}/><button className="primary" onClick={order}>Enviar pedido • {money(total)}</button></div></div>}

  {modal==="support"&&<div className="back"><div className="sheet"><div className="title"><h2>Suporte Denise</h2><button onClick={()=>setModal(null)}><X/></button></div><div className="chat">{messages.map((m,i)=><p key={i}>{m}</p>)}</div><div className="compose"><input value={msg} onChange={e=>setMsg(e.target.value)} placeholder="Digite sua mensagem..." onKeyDown={e=>{if(e.key==="Enter"&&msg.trim()){setMessages(x=>[...x,msg]);setMsg("")}}}/><button onClick={()=>{if(msg.trim()){setMessages(x=>[...x,msg]);setMsg("")}}}><Send/></button></div></div></div>}

  {modal==="admin"&&<div className="back"><div className="sheet wide"><div className="title"><h2>Painel Admin</h2><button onClick={()=>setModal(null)}><X/></button></div><button className="primary" onClick={()=>{setAdmin({id:"",name:"",description:"",price:0,category_id:"lanches",category:"Lanches",icon:"🍔"})}}>+ Novo produto</button>{admin&&<Editor value={admin} onSave={p=>{setProducts(x=>admin.id?x.map(y=>y.id===admin.id?p:y):[p,...x]);setAdmin(null)}} onCancel={()=>setAdmin(null)}/>}<div className="adminlist">{products.map(p=><div className="adminrow" key={p.id}><span className="mini">{p.icon}</span><div className="grow"><b>{p.name}</b><small>{money(p.price)} • {p.category}</small></div><button onClick={()=>setAdmin(p)}><Pencil/></button><button onClick={()=>setProducts(x=>x.filter(y=>y.id!==p.id))}><Trash2/></button></div>)}</div></div></div>}
  {toast&&<div className="toast">{toast}</div>}
 </div>
}

function Form({customer,setCustomer}:any){return <div className="form">{[["name","Nome","Seu nome"],["phone","Telefone","(21) 99999-9999"],["address","Endereço","Rua, número, bairro"]].map(([k,l,p])=><label key={k}>{l}<input value={customer[k]} onChange={e=>setCustomer({...customer,[k]:e.target.value})} placeholder={p}/></label>)}<label>Observação<textarea value={customer.notes} onChange={e=>setCustomer({...customer,notes:e.target.value})}/></label><label>Pagamento<select value={customer.payment} onChange={e=>setCustomer({...customer,payment:e.target.value})}><option>PIX</option><option>Dinheiro</option><option>Cartão na entrega</option><option>Mercado Pago (em breve)</option></select></label></div>}

function Editor({value,onSave,onCancel}:{value:Product;onSave:(p:Product)=>void;onCancel:()=>void}){
 const [p,setP]=useState(value);
 return <div className="editor"><label>Nome<input value={p.name} onChange={e=>setP({...p,name:e.target.value})}/></label><label>Descrição<textarea value={p.description} onChange={e=>setP({...p,description:e.target.value})}/></label><label>Preço<input type="number" step="0.01" value={p.price} onChange={e=>setP({...p,price:Number(e.target.value)})}/></label><label>Categoria<select value={p.category_id} onChange={e=>setP({...p,category_id:e.target.value,category:e.target.options[e.target.selectedIndex].text})}><option value="lanches">Lanches</option><option value="porcoes">Porções</option><option value="bebidas">Bebidas</option><option value="sobremesas">Sobremesas</option><option value="combos">Combos</option></select></label><label>Ícone<input value={p.icon} onChange={e=>setP({...p,icon:e.target.value})}/></label><button className="primary" onClick={()=>onSave({...p,id:p.id||`local-${Date.now()}`})}>Salvar</button><button className="secondary" onClick={onCancel}>Cancelar</button></div>
}