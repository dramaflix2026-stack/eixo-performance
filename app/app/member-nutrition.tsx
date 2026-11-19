"use client";
import {useMemo,useState} from "react";
import "./nutrition.css";
type Meal={id:string;title:string;examples:string[];note:string};
const meals:Meal[]=[
 {id:"manha",title:"Café da manhã",examples:["Fruta da estação","Aveia ou pão integral","Iogurte natural ou outra fonte de proteína"],note:"Escolha alimentos que façam sentido para sua rotina e preferências."},
 {id:"almoco",title:"Almoço",examples:["Arroz, batata ou outro cereal/tubérculo","Feijão, lentilha ou outra leguminosa","Verduras e legumes variados","Ovos, peixe, carne ou alternativa vegetal"],note:"Variedade e regularidade importam mais do que montar um prato perfeito."},
 {id:"lanche",title:"Lanche opcional",examples:["Fruta com castanhas","Iogurte natural","Sanduíche simples"],note:"Inclua um lanche quando sentir necessidade; não é uma obrigação."},
 {id:"noite",title:"Jantar",examples:["Legumes e verduras","Fonte de proteína de sua preferência","Arroz, massa, tubérculos ou outra fonte de energia"],note:"Ajuste a refeição à fome, ao horário e aos seus costumes."}
];
type Preference="variado"|"vegetariano";
export function EixoNutrition(){
 const [preference,setPreference]=useState<Preference>("variado");
 const [selected,setSelected]=useState<string[]>([]);
 const [water,setWater]=useState<number|null>(null);
 const [notes,setNotes]=useState("");
 const [saved,setSaved]=useState(false);
 const displayed=useMemo(()=>meals.map(meal=>({...meal,examples:meal.examples.map(x=>preference==="vegetariano"?x.replace("Ovos, peixe, carne ou alternativa vegetal","Ovos, tofu ou outras proteínas vegetais"):x)})),[preference]);
 return <section className="eixo-nutrition" aria-labelledby="eixo-nutrition-title">
  <header><span>08 / ALIMENTAÇÃO E BEM-ESTAR</span><h2 id="eixo-nutrition-title">Alimentar-se bem, <em>sem complicar.</em></h2><p>Um organizador educativo de refeições. Não é uma dieta, prescrição ou plano para melhorar desempenho íntimo.</p></header>
  <div className="eixo-nutrition-options"><span>PREFERÊNCIA ALIMENTAR</span><div><button type="button" aria-pressed={preference==="variado"} className={preference==="variado"?"active":""} onClick={()=>{setPreference("variado");setSaved(false)}}>Variada</button><button type="button" aria-pressed={preference==="vegetariano"} className={preference==="vegetariano"?"active":""} onClick={()=>{setPreference("vegetariano");setSaved(false)}}>Vegetariana</button></div></div>
  <div className="eixo-nutrition-summary"><div><span>SEU ORGANIZADOR</span><strong>Um dia de possibilidades.</strong><p>Selecione as refeições que deseja organizar. Os exemplos não definem porções nem calorias.</p></div><strong>{selected.length}/{meals.length}</strong></div>
  <div className="eixo-nutrition-grid">{displayed.map(meal=><article key={meal.id} className="eixo-nutrition-card"><div className="eixo-nutrition-card-top"><span>✦</span><h3>{meal.title}</h3></div><ul>{meal.examples.map(example=><li key={example}>{example}</li>)}</ul><p>{meal.note}</p><label><input type="checkbox" checked={selected.includes(meal.id)} onChange={e=>{setSaved(false);setSelected(prev=>e.target.checked?[...prev,meal.id]:prev.filter(x=>x!==meal.id))}}/> Incluir no meu planejamento</label></article>)}</div>
  <div className="eixo-nutrition-reflection"><h3>Como está sua rotina?</h3><p>Se desejar, registre apenas para você como pretende organizar suas refeições. Este texto não é enviado a nenhum servidor.</p><label htmlFor="eixo-nutrition-notes">Minhas anotações (opcional)</label><textarea id="eixo-nutrition-notes" maxLength={400} value={notes} onChange={e=>{setNotes(e.target.value);setSaved(false)}} placeholder="Ex.: organizar compras, preparar uma refeição com calma..."/>
  <fieldset><legend>Lembrei de me hidratar hoje?</legend><div className="eixo-nutrition-water"><button type="button" aria-pressed={water===1} onClick={()=>{setWater(1);setSaved(false)}}>Sim</button><button type="button" aria-pressed={water===0} onClick={()=>{setWater(0);setSaved(false)}}>Ainda não</button><button type="button" aria-pressed={water===null} onClick={()=>{setWater(null);setSaved(false)}}>Não informar</button></div></fieldset>
  <div className="eixo-nutrition-actions"><button type="button" onClick={()=>setSaved(true)}>CONCLUIR MEU PLANEJAMENTO ↗</button><button type="button" onClick={()=>{setSelected([]);setNotes("");setWater(null);setSaved(false)}}>LIMPAR</button></div>{saved&&<p role="status" className="eixo-nutrition-feedback">Planejamento organizado nesta tela. Suas escolhas e anotações não foram gravadas na conta e serão perdidas ao sair da página.</p>}</div>
  <aside className="eixo-nutrition-disclaimer"><strong>Orientação importante:</strong> necessidades nutricionais variam. Em caso de alergias, restrições alimentares, doenças, uso de medicamentos ou objetivos específicos, procure um nutricionista ou profissional de saúde habilitado. Não recomendamos restrições calóricas ou dietas individualizadas aqui.</aside>
 </section>;
}
