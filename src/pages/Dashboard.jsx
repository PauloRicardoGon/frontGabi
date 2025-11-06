import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { X, Menu } from "lucide-react";

export default function Dashboard() {
    const { user } = useAuth();
    const [dateString, setDateString] = useState("");
    const [isOpen, setIsOpen] = useState(false); // controla o menu sanduíche

    // Atualiza a data formatada
    useEffect(() => {
        const dataAtual = new Date();
        const formatador = new Intl.DateTimeFormat("pt-BR", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
        });
        const formatada = formatador.format(dataAtual);
        setDateString(formatada);
    }, []);

    // Mensagem de saudação dinâmica
    const hora = new Date().getHours();
    const saudacao =
        hora < 12 ? "Bom dia" : hora < 18 ? "Boa tarde" : "Boa noite";

    const userName = user?.name || "Usuário";

    return (

        <div className="p-6 min-h-[100dvh] bg-gradient-to-b from-[#3b6490] to-white overflow-hidden">

            {/* Saudação + botão menu na mesma linha */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-semibold mb-0.5 text-white">
                        {saudacao}, {userName}.
                    </h1>

                    {/* Data */}
                    <p className="text-white mb- capitalize">{dateString}</p>
                </div>

                {/* Botão menu */}
                <button
                    className="bg-white p-2 rounded shadow"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X /> : <Menu />}
                </button>
            </div>



            {/* Menu sanduíche flutuante à direita */}
            {isOpen && (
                <div className="absolute top-24 right-6 w-64 bg-white shadow-lg rounded-xl p-4 flex flex-col gap-4 z-50">
                    <nav className="flex flex-col gap-3">
                        <a href="/" className="hover:text-blue-600">Dashboard</a>
                        <a href="/clientes" className="hover:text-blue-600">Clientes</a>
                        <a href="/equipamentos" className="hover:text-blue-600">Equipamentos</a>
                        <a href="/ordens" className="hover:text-blue-600">Ordens de Serviço</a>
                    </nav>
                </div>
            )}

            {/* Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl p-4 shadow">
                    <h2 className="font-bold text-lg">Ordens em andamento</h2>
                    <p className="text-3xl mt-2 text-blue-600">12</p>
                </div>

                <div className="bg-white rounded-2xl p-4 shadow">
                    <h2 className="font-bold text-lg">Concluídas hoje</h2>
                    <p className="text-3xl mt-2 text-green-600">4</p>
                </div>

                <div className="bg-white rounded-2xl p-4 shadow">
                    <h2 className="font-bold text-lg">Pendentes</h2>
                    <p className="text-3xl mt-2 text-red-600">3</p>
                </div>
            </div>
        </div>

    );
}
