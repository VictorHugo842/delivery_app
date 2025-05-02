'use client';

import React, { useState, useEffect } from 'react';
import Title from '../../components/title';
import Image from 'next/image';
import LinkText from '../../components/link_text';
import Paragraph from '../../components/paragraph';

function Ajustes() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
        // Aguarda próximo tick para aplicar classe de transição
        setTimeout(() => {
            setIsVisible(true);
        }, 10); // Delay mínimo para dar tempo do modal montar antes da transição
    };

    const closeModal = () => {
        setIsVisible(false);
        setTimeout(() => {
            setIsModalOpen(false);
        }, 300); // Tempo da transição
    };

    // Trava o scroll do body quando o modal abre
    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isModalOpen]);

    return (
        <div className="min-h-screen p-5">
            {/* Título com margem */}
            <div className="mb-4">
                <Title className="text-xl font-bold text-gray-800" text="Ajustes" />
            </div>

            {/* Perfil */}
            <Title className="text-lg font-semibold text-gray-800" text="Perfil" />

            {/* Cards lado a lado */}
            <div className="flex items-center gap-4 mb-6">
                {/* Logo quadrado */}
                <div className="w-22 h-22 bg-gray-200 rounded-lg flex items-center justify-center">
                    <Image
                        src="/logo.png"
                        width={500}
                        height={500}
                        alt="Logo"
                        className="rounded-lg"
                        priority
                    />
                </div>

                {/* Informações ao lado */}
                <div className="flex flex-col">
                    <p className="text-sm font-bold text-gray-800 mb-1">Doceria</p>
                    <LinkText
                        href="#"
                        onClick={openModal}
                        className="inline-flex items-center text-base text-blue-500 hover:text-blue-700 transition-colors"
                    >
                        <Paragraph
                            text="Mostrar perfil"
                            className="font-bold text-[#eb445f]"
                        />
                        <span className="material-icons-round text-[#eb445f] ml-2">arrow_forward</span>
                    </LinkText>
                </div>
            </div>

            {/* Slide-in Modal */}
            {isModalOpen && (
                <div
                    className={`fixed inset-0 bg-black/30 flex justify-end z-50 transition-opacity duration-300 ease-in-out
                        ${isVisible ? 'opacity-100' : 'opacity-0'} 
                        overscroll-contain touch-none`} // Evita o scroll do fundo
                    onClick={closeModal}
                >
                    <div
                        className={`bg-white w-80 max-h-full p-6 shadow-lg rounded-l-lg transform transition-transform duration-300 ease-in-out
                            ${isVisible ? 'translate-x-0' : 'translate-x-full'}`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header do modal */}
                        <div className="flex items-center justify-between mb-2">
                            <Title className="text-lg font-semibold text-gray-800" text="Perfil da Loja" />
                            {/* Botão fechar (ícone X do Material Icons) */}
                            <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 text-3xl leading-none flex items-center">
                                <span className="material-icons-round">close</span>
                            </button>
                        </div>

                        {/* Linha de separação */}
                        <div className="w-16 h-1 bg-gray-200 rounded-full mx-auto mb-6"></div>

                        {/* Conteúdo com scroll suave */}
                        <div className="overflow-y-auto max-h-[calc(100vh-150px)] pr-1 scroll-smooth">
                            <p>Conteúdo do perfil aqui...</p>
                            <p>Conteúdo do perfil aqui...</p>
                            <p>Conteúdo do perfil aqui...</p>
                            <p>Conteúdo do perfil aqui...</p>
                            <p>Conteúdo do perfil aqui...</p>
                            <p>Conteúdo do perfil aqui...</p>
                            <p>Conteúdo do perfil aqui...</p>
                            <p>Conteúdo do perfil aqui...</p>
                            <p>Conteúdo do perfil aqui...</p>
                            <p>Conteúdo do perfil aqui...</p>
                            <p>Conteúdo do perfil aqui...</p>
                            <p>Conteúdo do perfil aqui...</p>
                            <p>Conteúdo do perfil aqui...</p>
                            <p>Conteúdo do perfil aqui...</p>
                            <p>Conteúdo do perfil aqui...</p>
                            <p>Conteúdo do perfil aqui...</p>
                            <p>Conteúdo do perfil aqui...</p>
                            <p>Conteúdo do perfil aqui...</p>
                            <p>Conteúdo do perfil aqui...</p>
                            <p>Conteúdo do perfil aqui...</p>
                            <p>Conteúdo do perfil aqui...</p>
                            <p>Conteúdo do perfil aqui...</p>
                            <p>Conteúdo do perfil aqui...</p>
                            <p>Conteúdo do perfil aqui...</p>
                            <p>Conteúdo do perfil aqui...</p>
                            <p>Conteúdo do perfil aqui...</p>
                            <p>Conteúdo do perfil aqui...</p>
                            <p>Conteúdo do perfil aqui...</p>
                            <p>Conteúdo do perfil aqui...</p>
                            <p>Conteúdo do perfil aqui...</p>
                            <p>Conteúdo do perfil aqui...</p>
                            <p>Conteúdo do perfil aqui...</p>
                            <p>Conteúdo do perfil aqui...</p>
                            <p>Conteúdo do perfil aqui...</p>
                            <p>Conteúdo do perfil aqui...</p>
                            <p>Conteúdo do perfil aqui...</p>
                            <p>Conteúdo do perfil aqui...</p>
                            <p>Conteúdo do perfil aqui...</p>
                            <p>Conteúdo do perfil aqui...</p>
                            <p>Conteúdo do perfil aqui...</p>
                            <p>Conteúdo do perfil aqui...</p>
                            <p>Conteúdo do perfil aqui...</p>
                            <p>Conteúdo do perfil aqui...</p>
                            <p>Conteúdo do perfil aqui...</p>
                            <p>Conteúdo do perfil aqui...</p>
                            <p>Conteúdo do perfil aqui...</p>
                            <p>Conteúdo do perfil aqui...</p>
                            <p>Conteúdo do perfil aqui...</p>
                            <p>Conteúdo do perfil aqui...</p>
                            <p>Conteúdo do perfil aqui...</p>
                            <p>Conteúdo do perfil aqui...</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Ajustes;
