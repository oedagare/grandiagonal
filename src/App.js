import { useState } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const USUARIOS_INICIAIS = [
  { id: 1, nome: "João", avatar: "👨", cor: "#3b82f6", peso: 78, altura: 178, obj_cal: 2400, obj_prot: 180, obj_hid: 260, obj_gord: 70, obj_agua: 3000 },
  { id: 2, nome: "Ana", avatar: "👩", cor: "#ec4899", peso: 62, altura: 165, obj_cal: 1900, obj_prot: 140, obj_hid: 200, obj_gord: 55, obj_agua: 2500 },
  { id: 3, nome: "Miguel", avatar: "👦", cor: "#10b981", peso: 55, altura: 160, obj_cal: 2100, obj_prot: 120, obj_hid: 250, obj_gord: 60, obj_agua: 2000 },
];

const ALIMENTOS_DB = [
  { nome: "Frango grelhado (100g)", cal: 165, prot: 31, hid: 0, gord: 3.6 },
  { nome: "Arroz cozido (100g)", cal: 130, prot: 2.7, hid: 28, gord: 0.3 },
  { nome: "Ovo inteiro", cal: 78, prot: 6, hid: 0.6, gord: 5 },
  { nome: "Aveia (50g)", cal: 190, prot: 6.5, hid: 32, gord: 3.5 },
  { nome: "Banana", cal: 89, prot: 1.1, hid: 23, gord: 0.3 },
  { nome: "Whey Protein (30g)", cal: 120, prot: 24, hid: 3, gord: 1.5 },
  { nome: "Batata-doce (100g)", cal: 86, prot: 1.6, hid: 20, gord: 0.1 },
  { nome: "Atum em lata (100g)", cal: 116, prot: 25, hid: 0, gord: 1 },
  { nome: "Salmão (100g)", cal: 208, prot: 20, hid: 0, gord: 13 },
  { nome: "Iogurte grego (100g)", cal: 97, prot: 9, hid: 3.6, gord: 5 },
  { nome: "Leite meio-gordo (200ml)", cal: 92, prot: 6.4, hid: 9.4, gord: 3.2 },
  { nome: "Pão integral (fatia)", cal: 80, prot: 3.5, hid: 15, gord: 1 },
  { nome: "Massa cozida (100g)", cal: 158, prot: 5.8, hid: 31, gord: 0.9 },
  { nome: "Bróculos (100g)", cal: 34, prot: 2.8, hid: 7, gord: 0.4 },
  { nome: "Azeite (10ml)", cal: 90, prot: 0, hid: 0, gord: 10 },
];

const EXERCICIOS = ["Supino Plano","Supino Inclinado","Agachamento","Leg Press","Peso Morto","Remada Curvada","Pull-up / Barra","Desenvolvimento","Curl Bicep","Tríceps Corda","Afundo","Hip Thrust","Prancha"];

const hoje = () => new Date().toISOString().split("T")[0];
const fmt = (n, d = 0) => Number(n || 0).toFixed(d);

const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-4 ${className}`}>{children}</div>
);

const ProgressBar = ({ value, max, color }) => (
  <div className="w-full bg-gray-100 rounded-full h-2">
    <div className="h-2 rounded-full transition-all" style={{ width: `${Math.min(100, (value / max) * 100)}%`, backgroundColor: color }} />
  </div>
);

const Btn = ({ children, onClick, variant = "primary", size = "md", className = "", disabled = false }) => {
  const s = { sm: "px-3 py-1.5 text-xs", md: "px-4 py-2 text-sm", lg: "px-6 py-3 text-base" };
  const v = { primary: "bg-gray-900 text-white hover:bg-gray-700", secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200", danger: "bg-red-100 text-red-600" };
  return <button onClick={onClick} disabled={disabled} className={`font-semibold rounded-xl transition-all ${s[size]} ${v[variant]} disabled:opacity-40 ${className}`}>{children}</button>;
};

const Input = ({ label, type = "text", value, onChange, placeholder, className = "" }) => (
  <div className={className}>
    {label && <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>}
    <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
  </div>
);

const Sel = ({ label, value, onChange, options, className = "" }) => (
  <div className={className}>
    {label && <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>}
    <select value={value} onChange={e => onChange(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
      {options.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
    </select>
  </div>
);

const SeletorPerfil = ({ usuarios, onSelect }) => (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center p-6">
    <div className="mb-8 text-center">
      <div className="text-4xl mb-2">💪</div>
      <h1 className="text-3xl font-bold text-gray-900">FamilyFit</h1>
      <p className="text-gray-500 text-sm mt-1">Quem está a treinar hoje?</p>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-sm sm:max-w-lg">
      {usuarios.map(u => (
        <button key={u.id} onClick={() => onSelect(u)}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center gap-3 hover:shadow-md hover:border-gray-300 transition-all group">
          <span className="text-5xl">{u.avatar}</span>
          <span className="font-semibold text-gray-800">{u.nome}</span>
          <div className="w-8 h-1 rounded-full" style={{ backgroundColor: u.cor }} />
        </button>
      ))}
    </div>
  </div>
);

const Dashboard = ({ u, registos, treinos }) => {
  const hoje_ = hoje();
  const rHoje = registos.filter(r => r.data === hoje_ && r.userId === u.id && r.tipo !== "agua");
  const cal = rHoje.reduce((s, r) => s + r.cal, 0);
  const prot = rHoje.reduce((s, r) => s + r.prot, 0);
  const hid = rHoje.reduce((s, r) => s + r.hid, 0);
  const gord = rHoje.reduce((s, r) => s + r.gord, 0);
  const agua = registos.filter(r => r.data === hoje_ && r.userId === u.id && r.tipo === "agua").reduce((s, r) => s + r.ml, 0);
  const tHoje = treinos.filter(t => t.data === hoje_ && t.userId === u.id);

  const ultimos7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    const ds = d.toISOString().split("T")[0];
    const c = registos.filter(r => r.data === ds && r.userId === u.id && r.tipo !== "agua").reduce((s, r) => s + r.cal, 0);
    return { dia: ["D","S","T","Q","Q","S","S"][d.getDay()], cal: c };
  });

  const pie = [
    { name: "Proteína", value: prot * 4, color: "#3b82f6" },
    { name: "Hidratos", value: hid * 4, color: "#f59e0b" },
    { name: "Gordura", value: gord * 9, color: "#ec4899" },
  ].filter(m => m.value > 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="text-4xl">{u.avatar}</span>
        <div>
          <h2 className="font-bold text-gray-900 text-xl">Olá, {u.nome}!</h2>
          <p className="text-xs text-gray-400">{new Date().toLocaleDateString("pt-PT", { weekday: "long", day: "numeric", month: "long" })}</p>
        </div>
      </div>
      <Card>
        <div className="flex justify-between items-center mb-2">
          <span className="font-semibold text-gray-800">🔥 Calorias Hoje</span>
          <span className="text-2xl font-bold" style={{ color: u.cor }}>{fmt(cal)}</span>
        </div>
        <ProgressBar value={cal} max={u.obj_cal} color={u.cor} />
        <p className="text-xs text-gray-400 mt-1">Objetivo: {u.obj_cal} kcal · Restam: {Math.max(0, u.obj_cal - cal)} kcal</p>
      </Card>
      <Card>
        <p className="font-semibold text-gray-800 mb-3">🥗 Macronutrientes</p>
        <div className="grid grid-cols-3 gap-2 text-center mb-2">
          <div><p className="text-xs text-gray-500">Proteína</p><p className="font-bold text-blue-600">{fmt(prot)}g</p><p className="text-xs text-gray-400">/{u.obj_prot}g</p></div>
          <div><p className="text-xs text-gray-500">Hidratos</p><p className="font-bold text-amber-500">{fmt(hid)}g</p><p className="text-xs text-gray-400">/{u.obj_hid}g</p></div>
          <div><p className="text-xs text-gray-500">Gordura</p><p className="font-bold text-pink-500">{fmt(gord)}g</p><p className="text-xs text-gray-400">/{u.obj_gord}g</p></div>
        </div>
        {pie.length > 0 && (
          <ResponsiveContainer width="100%" height={110}>
            <PieChart><Pie data={pie} cx="50%" cy="50%" innerRadius={30} outerRadius={50} paddingAngle={3} dataKey="value">
              {pie.map((e, i) => <Cell key={i} fill={e.color} />)}
            </Pie><Tooltip formatter={v => `${Math.round(v)} kcal`} /></PieChart>
          </ResponsiveContainer>
        )}
      </Card>
      <Card>
        <div className="flex justify-between items-center mb-2">
          <span className="font-semibold text-gray-800">💧 Água</span>
          <span className="font-bold text-blue-500">{agua} ml</span>
        </div>
        <ProgressBar value={agua} max={u.obj_agua} color="#3b82f6" />
        <p className="text-xs text-gray-400 mt-1">Objetivo: {u.obj_agua} ml</p>
      </Card>
      {tHoje.length > 0 && (
        <Card>
          <p className="font-semibold text-gray-800 mb-2">🏋️ Treinos de Hoje</p>
          {tHoje.map(t => (
            <div key={t.id} className="flex justify-between items-center py-2 border-t border-gray-50">
              <div className="flex items-center gap-2">
                <span>{t.tipo === "ciclismo" ? "🚴" : "🏋️"}</span>
                <span className="text-sm font-medium text-gray-700">{t.nome}</span>
              </div>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                {t.tipo === "ciclismo" ? `${t.distancia || 0}km` : `${t.exercicios?.length || 0} ex.`}
              </span>
            </div>
          ))}
        </Card>
      )}
      <Card>
        <p className="font-semibold text-gray-800 mb-3">📊 Calorias — 7 dias</p>
        <ResponsiveContainer width="100%" height={130}>
          <BarChart data={ultimos7}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="dia" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip formatter={v => `${v} kcal`} />
            <Bar dataKey="cal" fill={u.cor} radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};

const Nutricao = ({ u, registos, setRegistos }) => {
  const [aba, setAba] = useState("hoje");
  const [modalFood, setModalFood] = useState(false);
  const [modalAgua, setModalAgua] = useState(false);
  const [busca, setBusca] = useState("");
  const [form, setForm] = useState({ nome: "", cal: "", prot: "", hid: "", gord: "", refeicao: "almoço", qtd: "100" });
  const [aguaVal, setAguaVal] = useState("250");

  const rUser = registos.filter(r => r.userId === u.id);
  const rHoje = rUser.filter(r => r.data === hoje() && r.tipo !== "agua");
  const aguaHoje = rUser.filter(r => r.data === hoje() && r.tipo === "agua").reduce((s, r) => s + r.ml, 0);
  const resultados = busca.length > 1 ? ALIMENTOS_DB.filter(a => a.nome.toLowerCase().includes(busca.toLowerCase())) : [];

  const selecionar = (a) => {
    const q = Number(form.qtd) / 100;
    setForm({ ...form, nome: a.nome, cal: String(Math.round(a.cal * q)), prot: String((a.prot * q).toFixed(1)), hid: String((a.hid * q).toFixed(1)), gord: String((a.gord * q).toFixed(1)) });
    setBusca("");
  };

  const addFood = () => {
    if (!form.nome || !form.cal) return;
    setRegistos(p => [...p, { id: Date.now(), userId: u.id, data: hoje(), tipo: "alimento", refeicao: form.refeicao, nome: form.nome, cal: Number(form.cal), prot: Number(form.prot), hid: Number(form.hid), gord: Number(form.gord) }]);
    setForm({ nome: "", cal: "", prot: "", hid: "", gord: "", refeicao: "almoço", qtd: "100" });
    setModalFood(false);
  };

  const addAgua = () => {
    setRegistos(p => [...p, { id: Date.now(), userId: u.id, data: hoje(), tipo: "agua", ml: Number(aguaVal) }]);
    setModalAgua(false);
  };

  const ultimos30 = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (29 - i));
    const ds = d.toISOString().split("T")[0];
    const items = rUser.filter(r => r.data === ds && r.tipo !== "agua");
    return { dia: d.getDate(), cal: items.reduce((s, r) => s + r.cal, 0), prot: items.reduce((s, r) => s + r.prot, 0), hid: items.reduce((s, r) => s + r.hid, 0) };
  });

  const refs = ["pequeno-almoço", "almoço", "lanche", "jantar", "snack"];

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {["hoje", "30dias"].map(a => (
          <button key={a} onClick={() => setAba(a)} className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-all ${aba === a ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600"}`}>
            {a === "hoje" ? "Hoje" : "30 Dias"}
          </button>
        ))}
      </div>
      {aba === "hoje" && <>
        <div className="flex gap-2">
          <Btn onClick={() => setModalFood(true)} className="flex-1">+ Alimento</Btn>
          <Btn onClick={() => setModalAgua(true)} variant="secondary">💧 Água</Btn>
        </div>
        <Card>
          <div className="flex justify-between items-center mb-1">
            <span className="font-semibold text-sm text-gray-700">💧 Água hoje</span>
            <span className="font-bold text-blue-500 text-sm">{aguaHoje} / {u.obj_agua} ml</span>
          </div>
          <ProgressBar value={aguaHoje} max={u.obj_agua} color="#3b82f6" />
        </Card>
        {refs.map(ref => {
          const items = rHoje.filter(r => r.refeicao === ref);
          if (!items.length) return null;
          return (
            <Card key={ref}>
              <div className="flex justify-between mb-2">
                <span className="font-semibold text-sm capitalize text-gray-700">{ref}</span>
                <span className="text-xs text-gray-400">{items.reduce((s, r) => s + r.cal, 0)} kcal</span>
              </div>
              {items.map(item => (
                <div key={item.id} className="flex justify-between items-center py-1.5 border-t border-gray-50">
                  <div>
                    <p className="text-sm text-gray-800">{item.nome}</p>
                    <p className="text-xs text-gray-400">P:{fmt(item.prot)}g · H:{fmt(item.hid)}g · G:{fmt(item.gord)}g</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{item.cal} kcal</span>
                    <button onClick={() => setRegistos(p => p.filter(r => r.id !== item.id))} className="text-red-300 hover:text-red-500">✕</button>
                  </div>
                </div>
              ))}
            </Card>
          );
        })}
        {rHoje.length === 0 && <div className="text-center py-12 text-gray-400"><p className="text-3xl mb-2">🥗</p><p className="text-sm">Ainda sem refeições hoje</p></div>}
      </>}
      {aba === "30dias" && <Card>
        <p className="font-semibold text-gray-800 mb-3">📈 Evolução de Macros (30 dias)</p>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={ultimos30}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="dia" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip />
            <Line type="monotone" dataKey="prot" stroke="#3b82f6" dot={false} name="Proteína(g)" />
            <Line type="monotone" dataKey="hid" stroke="#f59e0b" dot={false} name="Hidratos(g)" />
          </LineChart>
        </ResponsiveContainer>
        <ResponsiveContainer width="100%" height={130} className="mt-3">
          <BarChart data={ultimos30}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="dia" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip formatter={v => `${Math.round(v)} kcal`} />
            <Bar dataKey="cal" fill={u.cor} radius={[4, 4, 0, 0]} name="Calorias" />
          </BarChart>
        </ResponsiveContainer>
      </Card>}
      {modalFood && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-4" onClick={() => setModalFood(false)}>
          <div className="bg-white rounded-2xl p-5 w-full max-w-md shadow-xl" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-gray-900 mb-3">Adicionar Alimento</h3>
            <div className="relative mb-3">
              <Input label="Pesquisar base de dados" value={busca} onChange={setBusca} placeholder="ex: frango, arroz..." />
              {resultados.length > 0 && (
                <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-xl shadow-lg mt-1 max-h-36 overflow-y-auto">
                  {resultados.map(a => (
                    <button key={a.nome} onClick={() => selecionar(a)} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 border-b border-gray-50 last:border-0">
                      <span className="font-medium">{a.nome}</span><span className="text-gray-400 text-xs ml-2">{a.cal} kcal</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Input label="Nome" value={form.nome} onChange={v => setForm({...form, nome: v})} className="col-span-2" />
              <Input label="Quantidade (g)" type="number" value={form.qtd} onChange={v => setForm({...form, qtd: v})} />
              <Input label="Calorias" type="number" value={form.cal} onChange={v => setForm({...form, cal: v})} />
              <Input label="Proteína (g)" type="number" value={form.prot} onChange={v => setForm({...form, prot: v})} />
              <Input label="Hidratos (g)" type="number" value={form.hid} onChange={v => setForm({...form, hid: v})} />
              <Input label="Gordura (g)" type="number" value={form.gord} onChange={v => setForm({...form, gord: v})} />
              <Sel label="Refeição" value={form.refeicao} onChange={v => setForm({...form, refeicao: v})} options={refs.map(r => ({v: r, l: r}))} className="col-span-2" />
            </div>
            <div className="flex gap-2 mt-3">
              <Btn onClick={addFood} className="flex-1">Adicionar</Btn>
              <Btn onClick={() => setModalFood(false)} variant="secondary">Cancelar</Btn>
            </div>
          </div>
        </div>
      )}
      {modalAgua && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setModalAgua(false)}>
          <div className="bg-white rounded-2xl p-5 w-full max-w-xs shadow-xl" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-gray-900 mb-3">💧 Registar Água</h3>
            <div className="grid grid-cols-3 gap-2 mb-3">
              {[150,250,330,500,750,1000].map(v => (
                <button key={v} onClick={() => setAguaVal(String(v))} className={`py-2 rounded-xl text-sm font-medium transition-all ${aguaVal === String(v) ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700"}`}>{v}ml</button>
              ))}
            </div>
            <Input label="Quantidade (ml)" type="number" value={aguaVal} onChange={setAguaVal} />
            <div className="flex gap-2 mt-3">
              <Btn onClick={addAgua} className="flex-1">Adicionar</Btn>
              <Btn onClick={() => setModalAgua(false)} variant="secondary">Cancelar</Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Treinos = ({ u, treinos, setTreinos }) => {
  const [aba, setAba] = useState("lista");
  const [tipoNovo, setTipoNovo] = useState(null);
  const [fC, setFC] = useState({ nome: "", data: hoje(), duracao: "", distancia: "", vel_med: "", vel_max: "", pot_med: "", pot_max: "", fc_med: "", fc_max: "", cadencia: "", elevacao: "", tss: "", notas: "" });
  const [fG, setFG] = useState({ nome: "", data: hoje(), exercicios: [], notas: "" });
  const [nEx, setNEx] = useState({ nome: "", series: [{ reps: "", peso: "" }] });

  const tUser = treinos.filter(t => t.userId === u.id).sort((a, b) => b.data.localeCompare(a.data));

  const gravarCiclo = () => {
    if (!fC.nome) return;
    const tss = fC.tss || (fC.duracao && fC.fc_med && fC.fc_max ? Math.round(((Number(fC.duracao) * Math.pow(Number(fC.fc_med)/Number(fC.fc_max), 2)) / 60) * 100) : 0);
    setTreinos(p => [...p, { id: Date.now(), userId: u.id, tipo: "ciclismo", ...fC, tss }]);
    setFC({ nome: "", data: hoje(), duracao: "", distancia: "", vel_med: "", vel_max: "", pot_med: "", pot_max: "", fc_med: "", fc_max: "", cadencia: "", elevacao: "", tss: "", notas: "" });
    setTipoNovo(null); setAba("lista");
  };

  const addSerie = () => setNEx(p => ({ ...p, series: [...p.series, { reps: "", peso: "" }] }));
  const updSerie = (i, campo, val) => setNEx(p => { const s = [...p.series]; s[i] = { ...s[i], [campo]: val }; return { ...p, series: s }; });
  const addEx = () => { if (!nEx.nome) return; setFG(p => ({ ...p, exercicios: [...p.exercicios, { ...nEx, id: Date.now() }] })); setNEx({ nome: "", series: [{ reps: "", peso: "" }] }); };
  const gravarGin = () => { if (!fG.nome || !fG.exercicios.length) return; setTreinos(p => [...p, { id: Date.now(), userId: u.id, tipo: "ginasio", ...fG }]); setFG({ nome: "", data: hoje(), exercicios: [], notas: "" }); setTipoNovo(null); setAba("lista"); };

  const stats8 = Array.from({ length: 8 }, (_, i) => {
    const ini = new Date(); ini.setDate(ini.getDate() - 7 * (7 - i));
    const fim = new Date(ini); fim.setDate(fim.getDate() + 7);
    const ts = tUser.filter(t => { const d = new Date(t.data); return d >= ini && d < fim; });
    return { sem: `S${i+1}`, ciclo: ts.filter(t => t.tipo==="ciclismo").length, gin: ts.filter(t => t.tipo==="ginasio").length, tss: ts.filter(t=>t.tipo==="ciclismo").reduce((s,t)=>s+Number(t.tss||0),0) };
  });

  if (tipoNovo === "ciclismo") return (
    <div className="space-y-3">
      <div className="flex items-center gap-3"><button onClick={() => setTipoNovo(null)} className="text-gray-400 hover:text-gray-600 text-sm">← Voltar</button><h3 className="font-bold text-gray-900">🚴 Novo Treino Ciclismo</h3></div>
      <Card>
        <div className="grid grid-cols-2 gap-3">
          <Input label="Nome" value={fC.nome} onChange={v=>setFC({...fC,nome:v})} placeholder="ex: Saída manhã" className="col-span-2"/>
          <Input label="Data" type="date" value={fC.data} onChange={v=>setFC({...fC,data:v})}/>
          <Input label="Duração (min)" type="number" value={fC.duracao} onChange={v=>setFC({...fC,duracao:v})}/>
          <Input label="Distância (km)" type="number" value={fC.distancia} onChange={v=>setFC({...fC,distancia:v})}/>
          <Input label="Vel. Média (km/h)" type="number" value={fC.vel_med} onChange={v=>setFC({...fC,vel_med:v})}/>
          <Input label="Vel. Máxima (km/h)" type="number" value={fC.vel_max} onChange={v=>setFC({...fC,vel_max:v})}/>
          <Input label="Potência Média (W)" type="number" value={fC.pot_med} onChange={v=>setFC({...fC,pot_med:v})}/>
          <Input label="Potência Máxima (W)" type="number" value={fC.pot_max} onChange={v=>setFC({...fC,pot_max:v})}/>
          <Input label="FC Média (bpm)" type="number" value={fC.fc_med} onChange={v=>setFC({...fC,fc_med:v})}/>
          <Input label="FC Máxima (bpm)" type="number" value={fC.fc_max} onChange={v=>setFC({...fC,fc_max:v})}/>
          <Input label="Cadência (RPM)" type="number" value={fC.cadencia} onChange={v=>setFC({...fC,cadencia:v})}/>
          <Input label="Elevação (m)" type="number" value={fC.elevacao} onChange={v=>setFC({...fC,elevacao:v})}/>
          <Input label="TSS (auto se vazio)" type="number" value={fC.tss} onChange={v=>setFC({...fC,tss:v})}/>
          <Input label="Notas" value={fC.notas} onChange={v=>setFC({...fC,notas:v})} placeholder="Como correu?" className="col-span-2"/>
        </div>
      </Card>
      <Btn onClick={gravarCiclo} className="w-full" size="lg">💾 Gravar Treino</Btn>
    </div>
  );

  if (tipoNovo === "ginasio") return (
    <div className="space-y-3">
      <div className="flex items-center gap-3"><button onClick={() => setTipoNovo(null)} className="text-gray-400 hover:text-gray-600 text-sm">← Voltar</button><h3 className="font-bold text-gray-900">🏋️ Novo Treino Ginásio</h3></div>
      <Card>
        <div className="grid grid-cols-2 gap-3">
          <Input label="Nome" value={fG.nome} onChange={v=>setFG({...fG,nome:v})} placeholder="ex: Push Day" className="col-span-2"/>
          <Input label="Data" type="date" value={fG.data} onChange={v=>setFG({...fG,data:v})}/>
          <Input label="Notas" value={fG.notas} onChange={v=>setFG({...fG,notas:v})} placeholder="Como correu?"/>
        </div>
      </Card>
      {fG.exercicios.map(ex => (
        <Card key={ex.id}>
          <div className="flex justify-between"><p className="font-semibold text-sm">{ex.nome}</p><button onClick={()=>setFG(p=>({...p,exercicios:p.exercicios.filter(e=>e.id!==ex.id)}))} className="text-red-300 text-xs">✕</button></div>
          <p className="text-xs text-gray-500 mt-1">{ex.series.map((s,i)=>`S${i+1}: ${s.reps}×${s.peso}kg`).join(" · ")}</p>
        </Card>
      ))}
      <Card>
        <p className="font-semibold text-sm text-gray-800 mb-2">+ Adicionar Exercício</p>
        <Sel label="Exercício" value={nEx.nome} onChange={v=>setNEx({...nEx,nome:v})} options={[{v:"",l:"Selecionar..."}, ...EXERCICIOS.map(e=>({v:e,l:e}))]} className="mb-3"/>
        {nEx.series.map((s,i)=>(
          <div key={i} className="flex gap-2 mb-2 items-end">
            <Input label={`S${i+1} Reps`} type="number" value={s.reps} onChange={v=>updSerie(i,"reps",v)} className="flex-1"/>
            <Input label="Peso(kg)" type="number" value={s.peso} onChange={v=>updSerie(i,"peso",v)} className="flex-1"/>
          </div>
        ))}
        <div className="flex gap-2 mt-1"><Btn onClick={addSerie} variant="secondary" size="sm">+ Série</Btn><Btn onClick={addEx} size="sm">Adicionar</Btn></div>
      </Card>
      <Btn onClick={gravarGin} className="w-full" size="lg" disabled={!fG.exercicios.length}>💾 Gravar Treino</Btn>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {["lista","stats"].map(a=>(
          <button key={a} onClick={()=>setAba(a)} className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-all ${aba===a?"bg-gray-900 text-white":"bg-gray-100 text-gray-600"}`}>
            {a==="lista"?"Histórico":"Estatísticas"}
          </button>
        ))}
      </div>
      {aba==="lista" && <>
        <div className="grid grid-cols-2 gap-3">
          <button onClick={()=>setTipoNovo("ciclismo")} className="bg-blue-50 border border-blue-100 rounded-2xl p-4 text-center hover:bg-blue-100 transition-all"><div className="text-3xl mb-1">🚴</div><p className="text-sm font-semibold text-blue-700">Ciclismo</p></button>
          <button onClick={()=>setTipoNovo("ginasio")} className="bg-green-50 border border-green-100 rounded-2xl p-4 text-center hover:bg-green-100 transition-all"><div className="text-3xl mb-1">🏋️</div><p className="text-sm font-semibold text-green-700">Ginásio</p></button>
        </div>
        {tUser.length===0 && <div className="text-center py-12 text-gray-400"><p className="text-3xl mb-2">🏆</p><p className="text-sm">Ainda sem treinos registados</p></div>}
        {tUser.map(t=>(
          <Card key={t.id}>
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <span>{t.tipo==="ciclismo"?"🚴":"🏋️"}</span>
                <div><p className="font-semibold text-gray-800">{t.nome}</p><p className="text-xs text-gray-400">{new Date(t.data).toLocaleDateString("pt-PT")}</p></div>
              </div>
              <button onClick={()=>setTreinos(p=>p.filter(x=>x.id!==t.id))} className="text-red-300 hover:text-red-500 text-xs">✕</button>
            </div>
            {t.tipo==="ciclismo" ? (
              <div className="grid grid-cols-3 gap-2 text-center">
                {t.distancia&&<div className="bg-gray-50 rounded-xl p-2"><p className="text-xs text-gray-500">Dist.</p><p className="font-bold text-sm">{t.distancia}km</p></div>}
                {t.duracao&&<div className="bg-gray-50 rounded-xl p-2"><p className="text-xs text-gray-500">Tempo</p><p className="font-bold text-sm">{t.duracao}min</p></div>}
                {t.pot_med&&<div className="bg-gray-50 rounded-xl p-2"><p className="text-xs text-gray-500">Pot.</p><p className="font-bold text-sm">{t.pot_med}W</p></div>}
                {t.fc_med&&<div className="bg-gray-50 rounded-xl p-2"><p className="text-xs text-gray-500">FC</p><p className="font-bold text-sm">{t.fc_med}bpm</p></div>}
                {t.elevacao&&<div className="bg-gray-50 rounded-xl p-2"><p className="text-xs text-gray-500">Elev.</p><p className="font-bold text-sm">{t.elevacao}m</p></div>}
                {t.tss&&<div className="bg-blue-50 rounded-xl p-2"><p className="text-xs text-blue-500">TSS</p><p className="font-bold text-sm text-blue-700">{t.tss}</p></div>}
              </div>
            ) : (
              <div>{t.exercicios?.map(ex=>(
                <div key={ex.id} className="py-1.5 border-t border-gray-50">
                  <p className="text-sm font-medium text-gray-700">{ex.nome}</p>
                  <p className="text-xs text-gray-400">{ex.series.map((s,i)=>`S${i+1}: ${s.reps}×${s.peso}kg`).join(" · ")}</p>
                </div>
              ))}</div>
            )}
            {t.notas&&<p className="text-xs text-gray-400 mt-2 italic">"{t.notas}"</p>}
          </Card>
        ))}
      </>}
      {aba==="stats" && <div className="space-y-4">
        <Card>
          <p className="font-semibold text-gray-800 mb-3">📊 Volume (8 semanas)</p>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={stats8}><CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6"/><XAxis dataKey="sem" tick={{fontSize:11}}/><YAxis tick={{fontSize:11}}/><Tooltip/>
              <Bar dataKey="ciclo" fill="#3b82f6" radius={[4,4,0,0]} name="Ciclismo"/>
              <Bar dataKey="gin" fill="#10b981" radius={[4,4,0,0]} name="Ginásio"/>
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <p className="font-semibold text-gray-800 mb-3">⚡ TSS Semanal</p>
          <ResponsiveContainer width="100%" height={130}>
            <BarChart data={stats8}><CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6"/><XAxis dataKey="sem" tick={{fontSize:11}}/><YAxis tick={{fontSize:11}}/><Tooltip/>
              <Bar dataKey="tss" fill="#f59e0b" radius={[4,4,0,0]} name="TSS"/>
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <div className="grid grid-cols-2 gap-3">
          <Card className="text-center"><p className="text-2xl font-bold text-blue-600">{tUser.filter(t=>t.tipo==="ciclismo").length}</p><p className="text-xs text-gray-500 mt-1">Saídas ciclismo</p></Card>
          <Card className="text-center"><p className="text-2xl font-bold text-green-600">{tUser.filter(t=>t.tipo==="ginasio").length}</p><p className="text-xs text-gray-500 mt-1">Sessões ginásio</p></Card>
          <Card className="text-center"><p className="text-2xl font-bold text-gray-800">{tUser.filter(t=>t.tipo==="ciclismo").reduce((s,t)=>s+Number(t.distancia||0),0).toFixed(0)}km</p><p className="text-xs text-gray-500 mt-1">Total pedalado</p></Card>
          <Card className="text-center"><p className="text-2xl font-bold text-amber-500">{tUser.filter(t=>t.tipo==="ciclismo").reduce((s,t)=>s+Number(t.tss||0),0)}</p><p className="text-xs text-gray-500 mt-1">TSS total</p></Card>
        </div>
      </div>}
    </div>
  );
};

const Perfil = ({ u, setUsuarios, pesos, setPesos }) => {
  const [novoPeso, setNovoPeso] = useState("");
  const [editando, setEditando] = useState(false);
  const [ef, setEf] = useState({...u});
  const reg = pesos.filter(p=>p.userId===u.id).sort((a,b)=>a.data.localeCompare(b.data));
  const ultimoPeso = reg.length > 0 ? reg[reg.length-1].peso : u.peso;
  const imc = (ultimoPeso / Math.pow(u.altura/100,2)).toFixed(1);

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{u.avatar}</span>
            <div><p className="font-bold text-gray-900 text-lg">{u.nome}</p><p className="text-xs text-gray-500">{u.altura}cm · {ultimoPeso}kg · IMC {imc}</p></div>
          </div>
          <Btn onClick={()=>setEditando(!editando)} variant="secondary" size="sm">{editando?"Cancelar":"Editar"}</Btn>
        </div>
        {editando && (
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Input label="Altura (cm)" type="number" value={ef.altura} onChange={v=>setEf({...ef,altura:v})}/>
            <Input label="Obj. Calorias" type="number" value={ef.obj_cal} onChange={v=>setEf({...ef,obj_cal:v})}/>
            <Input label="Obj. Proteína (g)" type="number" value={ef.obj_prot} onChange={v=>setEf({...ef,obj_prot:v})}/>
            <Input label="Obj. Hidratos (g)" type="number" value={ef.obj_hid} onChange={v=>setEf({...ef,obj_hid:v})}/>
            <Input label="Obj. Gordura (g)" type="number" value={ef.obj_gord} onChange={v=>setEf({...ef,obj_gord:v})}/>
            <Input label="Obj. Água (ml)" type="number" value={ef.obj_agua} onChange={v=>setEf({...ef,obj_agua:v})}/>
            <Btn onClick={()=>{setUsuarios(p=>p.map(x=>x.id===u.id?{...x,...ef}:x));setEditando(false);}} className="col-span-2">Guardar</Btn>
          </div>
        )}
      </Card>
      <Card>
        <p className="font-semibold text-gray-800 mb-3">⚖️ Registo de Peso</p>
        <div className="flex gap-2 mb-4">
          <Input type="number" value={novoPeso} onChange={setNovoPeso} placeholder="ex: 78.5" className="flex-1"/>
          <Btn onClick={()=>{if(!novoPeso)return;setPesos(p=>[...p,{id:Date.now(),userId:u.id,data:hoje(),peso:Number(novoPeso)}]);setNovoPeso("");}}>Registar</Btn>
        </div>
        {reg.length > 1 && (
          <ResponsiveContainer width="100%" height={150}>
            <LineChart data={reg}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6"/>
              <XAxis dataKey="data" tick={{fontSize:10}} tickFormatter={d=>d.slice(5)}/>
              <YAxis domain={["dataMin - 2","dataMax + 2"]} tick={{fontSize:10}} unit="kg"/>
              <Tooltip formatter={v=>`${v} kg`}/>
              <Line type="monotone" dataKey="peso" stroke={u.cor} dot={{fill:u.cor,r:3}} name="Peso"/>
            </LineChart>
          </ResponsiveContainer>
        )}
        {reg.length===0 && <p className="text-xs text-gray-400 text-center py-4">Ainda sem registos de peso</p>}
      </Card>
      <Card>
        <p className="font-semibold text-gray-800 mb-3">🎯 Objetivos Diários</p>
        <div className="space-y-2">
          {[["Calorias",u.obj_cal,"kcal"],["Proteína",u.obj_prot,"g"],["Hidratos",u.obj_hid,"g"],["Gordura",u.obj_gord,"g"],["Água",u.obj_agua,"ml"]].map(([l,v,unit])=>(
            <div key={l} className="flex justify-between text-sm"><span className="text-gray-600">{l}</span><span className="font-semibold">{v} {unit}</span></div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default function App() {
  const [usuarios, setUsuarios] = useState(USUARIOS_INICIAIS);
  const [ativo, setAtivo] = useState(null);
  const [pagina, setPagina] = useState("dashboard");
  const [registos, setRegistos] = useState([]);
  const [treinos, setTreinos] = useState([]);
  const [pesos, setPesos] = useState([]);

  const u = usuarios.find(x => x.id === ativo?.id) || ativo;

  if (!ativo) return <SeletorPerfil usuarios={usuarios} onSelect={u=>{setAtivo(u);setPagina("dashboard");}}/>;

  const nav = [
    {id:"dashboard",icon:"🏠",label:"Início"},
    {id:"nutricao",icon:"🥗",label:"Nutrição"},
    {id:"treinos",icon:"💪",label:"Treinos"},
    {id:"perfil",icon:"👤",label:"Perfil"},
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-lg mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2"><span className="text-xl">{u?.avatar}</span><span className="font-bold text-gray-900">FamilyFit</span></div>
          <button onClick={()=>setAtivo(null)} className="text-xs text-gray-400 hover:text-gray-600 bg-gray-100 px-3 py-1.5 rounded-xl">Trocar perfil</button>
        </div>
      </div>
      <div className="max-w-lg mx-auto px-4 py-4 pb-24">
        {pagina==="dashboard" && <Dashboard u={u} registos={registos} treinos={treinos}/>}
        {pagina==="nutricao" && <Nutricao u={u} registos={registos} setRegistos={setRegistos}/>}
        {pagina==="treinos" && <Treinos u={u} treinos={treinos} setTreinos={setTreinos}/>}
        {pagina==="perfil" && <Perfil u={u} setUsuarios={setUsuarios} pesos={pesos} setPesos={setPesos}/>}
      </div>
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-40">
        <div className="max-w-lg mx-auto flex">
          {nav.map(n=>(
            <button key={n.id} onClick={()=>setPagina(n.id)} className={`flex-1 flex flex-col items-center py-3 transition-all ${pagina===n.id?"text-gray-900":"text-gray-400 hover:text-gray-600"}`}>
              <span className="text-xl">{n.icon}</span>
              <span className="text-xs mt-0.5 font-medium">{n.label}</span>
              {pagina===n.id && <div className="w-1 h-1 rounded-full bg-gray-900 mt-0.5"/>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
