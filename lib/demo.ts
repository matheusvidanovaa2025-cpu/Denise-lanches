export const categories=[
{id:"todos",name:"Todos",icon:"✦"},
{id:"lanches",name:"Lanches",icon:"🍔"},
{id:"porcoes",name:"Porções",icon:"🍟"},
{id:"bebidas",name:"Bebidas",icon:"🥤"},
{id:"sobremesas",name:"Sobremesas",icon:"🍰"},
{id:"combos",name:"Combos",icon:"🔥"}];

export const products=[
["p1","X-Bacon Especial","Hambúrguer, queijo, bacon crocante e molho da casa.",24.90,"lanches","🍔"],
["p2","X-Tudo Denise","O clássico completo da casa, bem servido e caprichado.",32.90,"lanches","🍔"],
["p3","X-Frango Cremoso","Frango desfiado, queijo cremoso e tempero especial.",22.90,"lanches","🍔"],
["p4","Cachorro-Quente Completo","Salsicha, molho, queijo, milho e batata palha.",19.90,"lanches","🌭"],
["p5","Batata Frita Crocante","Douradinha, crocante por fora e macia por dentro.",18.90,"porcoes","🍟"],
["p6","Batata Cheddar & Bacon","Batata coberta com cheddar cremoso e bacon.",27.90,"porcoes","🍟"],
["p7","Nuggets — 10 unidades","Crocantes para acompanhar seu lanche.",21.90,"porcoes","🍗"],
["p8","Coca-Cola 350ml","Lata gelada.",6.50,"bebidas","🥤"],
["p9","Guaraná 350ml","Lata gelada.",6.50,"bebidas","🥤"],
["p10","Suco Natural 500ml","Preparado na hora.",9.90,"bebidas","🧃"],
["p11","Milk-shake de Chocolate","Cremoso, gelado e finalizado com chocolate.",16.90,"sobremesas","🥤"],
["p12","Sobremesa da Casa","Uma opção doce para fechar o pedido.",12.90,"sobremesas","🍰"],
["p13","Combo Denise","Lanche + batata + bebida.",39.90,"combos","🍔"],
["p14","Combo X-Tudo","X-Tudo + batata + bebida.",47.90,"combos","🍔"],
["p15","Combo Frango","X-Frango + batata + bebida.",42.90,"combos","🍔"]
].map(([id,name,description,price,category,icon])=>({id,name,description,price:Number(price),category_id:category,category,icon}));