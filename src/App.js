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
    <div className="h-2 roun
