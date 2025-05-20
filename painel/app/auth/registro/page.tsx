'use client';

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import Input from '../../components/input';
import Button from '../../components/button';
import Title from '../../components/title';
import Paragraph from '../../components/paragraph';
import ContainerForm from '../../components/container_form';
import CheckboxText from '../../components/checkbox_text';
import LinkText from '../../components/link_text';
import LoadingLine from '../../components/loading_line';
import { checkLogin } from '../../utils/check_login'; // Importando a função utilitária

export default function PaginaRegistro() {

    const [loading, setLoading] = useState(true); // Estado para controlar a tela de redirecionamento
    const [step, setStep] = useState(1);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const router = useRouter();

    // Estado para armazenar as unidades, definindo explicitamente que será um array de strings
    const [unidades, setUnidades] = useState<string[]>([]);
    const [unidadeInput, setUnidadeInput] = useState('');
    //const [mostrarUnidades, setMostrarUnidades] = useState(false);

    // Verifica se o usuário está logado no início
    useEffect(() => {
        const verifyAuth = async () => {
            await checkLogin(router, setLoading); // Chama a função de utilitário
        };

        verifyAuth();
    }, [router]);

    const { control, handleSubmit, watch, getValues, setValue, trigger, formState: { errors } } = useForm({
        defaultValues: {
            nomeUsuario: '',
            email: '',
            documento: '',
            integrarWhatsapp: false,
            telefoneWhatsappBusiness: '',
            telefone: '',
            nomeEstabelecimento: '',
            tipoEstabelecimento: '',
            senha: '',
            confirmarSenha: '',
            unidades: [] as string[]
        },
    });
    const integrarWhatsapp = watch('integrarWhatsapp');

    // Adicionar unidade
    const addUnidade = () => {
        if (unidadeInput.trim() === '') return;

        const novasUnidades = [...unidades, unidadeInput.trim()];

        console.log(novasUnidades);
        console.log(setValue);

        setUnidades(novasUnidades);
        setValue('unidades', novasUnidades);

        setUnidadeInput('');
    };

    // Remover unidade
    const removeUnidade = (index: number) => {
        const novasUnidades = unidades.filter((_, i) => i !== index);
        setUnidades(novasUnidades);
        setValue('unidades', novasUnidades);
    };

    const camposValidos = [
        "nomeUsuario",
        "email",
        "documento",
        "telefone",
        "telefoneWhatsappBusiness",
        "nomeEstabelecimento",
        "integrarWhatsapp",
        "tipoEstabelecimento",
        "senha",
        "confirmarSenha",
        "unidades"
    ] as const;

    type CamposValidos = typeof camposValidos[number];

    const handleProximo = async () => {
        let camposParaValidar: CamposValidos[] = [];
        // VALIDAÇÕES PARA TELEFONE BUSINESS, SE TIVER CHECKADO, DEVE SER OBRIGATÓRI
        if (step === 1) {
            camposParaValidar = ["nomeUsuario", "email", "telefone", "documento"];
        } else if (step === 2) {
            camposParaValidar = ["nomeEstabelecimento", "tipoEstabelecimento", "unidades"];
        }

        const valido = await trigger(camposParaValidar);

        if (valido) {
            setStep(step + 1);
        }
    };

    const handleVoltar = () => {
        if (step > 1) {
            setError('');
            setStep(step - 1);
        }
    };

    const handleFinalizar = async () => {
        const valido = await trigger(["senha", "confirmarSenha"]);

        if (valido) {
            onSubmit(getValues()); // Chama o onSubmit para submeter os dados
        }
    };


    const onSubmit = async (data: any) => {
        setError('');
        setSuccess('');

        try {
            const payload = {
                nome_estabelecimento: data.nomeEstabelecimento,
                telefone: data.telefone,
                telefoneWhatsappBusiness: data.telefoneWhatsappBusiness,
                nome_usuario: data.nomeUsuario,
                documento: data.documento,
                email: data.email,
                integrarWhatsapp: data.integrarWhatsapp,
                tipo_estabelecimento: data.tipoEstabelecimento,
                senha: data.senha,
                confirmar_senha: data.confirmarSenha,
                unidades: data.unidades
            };

            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/painel/registrar`,
                payload,
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true,
                }
            );

            // Sucesso no registro
            setSuccess('Registro realizado com sucesso!');
            console.log('Registro bem-sucedido:', response.data);

            router.push('/admin/delivery');  // Redireciona após o sucesso
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                // Logar informações completas sobre o erro de Axios
                console.log('Erro de Axios:', error); // Loga o erro completo
                setError(error.response?.data?.msg || 'Erro ao registrar usuário');
                console.log('Erro ao registrar usuário:', error.response?.data);
            } else {
                console.log('Erro inesperado:', error); // Loga o erro completo
                setError('Erro inesperado: ' + error.message);
            }
        }

    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-8">
                <LoadingLine />
            </div>
        );
    }


    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <ContainerForm>
                <Title className="font-semibold" text="Crie sua conta" />
                <Paragraph
                    text={step === 1 ? 'Fala um pouco sobre você.' : step === 2 ? 'Queremos conhecer seu negócio.' : 'Defina sua senha.'}
                    className="mb-6"
                />

                {error && <p className="text-red-600 mb-4">{error}</p>}
                {success && <p className="text-green-600 mb-4">{success}</p>}

                <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    {/* Etapa 1 */}
                    {step === 1 && (
                        <>
                            <Controller
                                name="nomeUsuario"
                                control={control}
                                rules={{ required: 'Nome é obrigatório', minLength: { value: 3, message: 'Nome muito curto' } }}
                                render={({ field }) => <Input type="text" label="Nome" placeholder="Digite seu nome" {...field} error={errors.nomeUsuario} />}
                            />

                            <Controller
                                name="email"
                                control={control}
                                rules={{ required: 'E-mail é obrigatório', pattern: { value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/, message: 'E-mail inválido' } }}
                                render={({ field }) => <Input label="E-mail" type="email" placeholder="Digite seu e-mail" {...field} error={errors.email} />}
                            />

                            <Controller
                                name="telefone"
                                control={control}
                                rules={{ required: 'Telefone é obrigatório' }}
                                render={({ field }) => <Input label="Telefone Pessoal" type="tel" placeholder="Digite seu telefone" {...field} error={errors.telefone} />}
                            />
                            <Controller
                                name="documento"
                                control={control}
                                rules={{ required: 'CPF ou CNPJ é obrigatório' }}
                                render={({ field }) => <Input label="CPF\CNPJ" type="tel" placeholder="Digite seu documento" {...field} error={errors.documento} />}
                            />
                            {/* <Controller
                                name="integrarWhatsapp"
                                control={control}
                                render={({ field }) => (
                                    <CheckboxText
                                        checked={field.value}
                                        onChange={field.onChange}
                                        label="Ativar integração com WhatsApp (requer WhatsApp Business)"
                                    />
                                )}
                            />

                            <div
                                className={`transition-all duration-300 ease-in-out ${integrarWhatsapp ? 'opacity-100 max-h-screen' : 'opacity-0 max-h-0 overflow-hidden'
                                    }`}
                            >
                                {integrarWhatsapp && (
                                    <Controller
                                        name="telefoneWhatsappBusiness"
                                        control={control}
                                        rules={{ required: 'Telefone para WhatsApp Business é obrigatório' }}
                                        render={({ field }) => (
                                            <Input
                                                label="Telefone WhatsApp Business"
                                                type="tel"
                                                placeholder="Digite seu WhatsApp Business"
                                                {...field}
                                                error={errors.telefone}
                                            />
                                        )}
                                    />
                                )}
                            </div> */}
                        </>
                    )}

                    {/* Etapa 2 */}
                    {step === 2 && (
                        <>
                            <Controller
                                name="nomeEstabelecimento"
                                control={control}
                                rules={{ required: 'Nome do Estabelecimento é obrigatório' }}
                                render={({ field }) => <Input type="text" label="Nome do Estabelecimento" placeholder="Digite o nome do Estabelecimento" {...field} error={errors.nomeEstabelecimento} />}
                            />

                            <Controller
                                name="tipoEstabelecimento"
                                control={control}
                                rules={{ required: 'Tipo de estabelecimento é obrigatório' }}
                                render={({ field }) => (
                                    <Input
                                        label="Tipo de Estabelecimento"
                                        type="select"
                                        options={[
                                            { value: 'restaurante', label: 'Restaurante' },
                                            { value: 'lanchonete', label: 'Lanchonete' },
                                            { value: 'hamburgueria', label: 'Hamburgueria' },
                                            { value: 'doceria', label: 'Doceria' },
                                            { value: 'acaiteria', label: 'Açaiteria' },
                                            { value: 'pizzaria', label: 'Pizzaria' },
                                            { value: 'bar / petiscaria', label: 'Bar / Petiscaria' },
                                            { value: 'saladeria', label: 'Saladeria' },
                                            { value: 'distribuidora de bebidas', label: 'Distribuidora de Bebidas' },
                                            { value: 'padaria', label: 'Padaria' },
                                            { value: 'cafeteria', label: 'Cafeteria' },
                                            { value: 'sorveteria', label: 'Sorveteria' },
                                            { value: 'comida oriental', label: 'Comida Oriental' },
                                        ]}
                                        {...field}
                                        error={errors.tipoEstabelecimento}
                                    />
                                )}
                            />


                            {/*<Paragraph text="Deseja adicionar unidades?" className="font-medium mb-2" /> */}

                            {/* Checkbox para ativar a lista de unidades */}
                            {/* <CheckboxText
                                checked={mostrarUnidades}
                                onChange={() => setMostrarUnidades(!mostrarUnidades)}
                                label="Sim"
                                className="mb-4"
                            /> */}

                            {/* Condicionalmente renderiza a lista de unidades se o checkbox estiver marcado */}
                            {/* {mostrarUnidades && ( */}
                            <div className="shadow-sm border border-gray-300 rounded-md p-3">
                                {/* Bloco do input + botão */}
                                <div className="flex items-center gap-3">
                                    {/* Input que cresce */}
                                    <div className="flex-grow">
                                        <Controller
                                            name="unidades"
                                            control={control}
                                            rules={{ required: 'É necessário adicionar pelo menos uma unidade' }}
                                            render={({ field }) => (
                                                <Input
                                                    type="text"
                                                    label="Unidade"
                                                    placeholder="Digite o nome da unidade"
                                                    {...field}
                                                    value={unidadeInput}
                                                    onChange={(e) => setUnidadeInput(e.target.value)}
                                                    error={Array.isArray(errors.unidades) ? errors.unidades[0] : errors.unidades}
                                                    className="w-full"
                                                />
                                            )}
                                        />
                                    </div>

                                    {/* Botão colado na direita */}
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            addUnidade();
                                        }}
                                        className="bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition flex-shrink-0"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Lista de unidades */}
                                <div className="overflow-x-auto mt-0.5">
                                    <table className="min-w-full table-auto text-sm text-gray-700">
                                        <thead className="bg-gray-100">
                                            <tr>
                                                <th className="px-4 py-2 text-left">Unidade</th>
                                                <th className="px-4 py-2 text-left">Ações</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {unidades.map((unidade, index) => (
                                                <tr key={index} className="border-b even:bg-gray-50">
                                                    <td className="px-4 py-2">{unidade}</td>
                                                    <td className="px-4 py-2">
                                                        <button
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                removeUnidade(index);
                                                            }}
                                                            className="text-red-500 hover:text-red-600"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* )} */}


                            {/* 
                            <Paragraph text="Como você trabalha hoje?" className="font-medium mb-2" />
                            <Controller
                                name="modoOperacao"
                                control={control}
                                rules={{
                                    validate: (value) => value.length > 0 || 'Selecione pelo menos uma opção',
                                }}
                                defaultValue={[]}
                                render={({ field }) => (
                                    <>
                                        {["Retirada no local", "Entregas delivery", "Emissão de nota fiscal"].map((opcao) => (
                                            <div key={opcao} className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    id={opcao}
                                                    checked={field.value.includes(opcao)}
                                                    onChange={() => {
                                                        const newValue = field.value.includes(opcao)
                                                            ? field.value.filter((item: string) => item !== opcao)
                                                            : [...field.value, opcao];
                                                        field.onChange(newValue);
                                                    }}
                                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                                                />
                                                <label htmlFor={opcao} className="text-sm text-gray-700">{opcao}</label>
                                            </div>
                                        ))}
                                        {errors.modoOperacao && (
                                            <p className="text-red-600 text-xs">{errors.modoOperacao.message}</p>
                                        )}
                                    </>
                                )}
                            /> */}
                        </>
                    )}

                    {/* Etapa 3 */}
                    {step === 3 && (
                        <>
                            <Controller
                                name="senha"
                                control={control}
                                rules={{
                                    required: 'Senha é obrigatória',
                                    minLength: {
                                        value: 6,
                                        message: 'A senha precisa ter pelo menos 6 caracteres',
                                    },
                                }}
                                render={({ field }) => (
                                    <Input
                                        label="Senha"
                                        type="password"
                                        placeholder="Digite sua senha"
                                        {...field}
                                        error={errors.senha}
                                    />
                                )}
                            />

                            <Controller
                                name="confirmarSenha"
                                control={control}
                                rules={{
                                    required: 'Confirme sua senha',
                                    validate: (value) =>
                                        value === watch('senha') || 'As senhas não coincidem',
                                }}
                                render={({ field }) => (
                                    <Input
                                        label="Confirmar Senha"
                                        type="password"
                                        placeholder="Confirme sua senha"
                                        {...field}
                                        error={errors.confirmarSenha}
                                    />
                                )}
                            />
                        </>
                    )}

                    <div className="flex justify-between">
                        {step > 1 && (
                            <button
                                type="button"
                                onClick={handleVoltar}
                                className="flex items-center text-lg text-[#ea1d2c]"
                            >
                                <span className="material-icons-round">arrow_back</span> {/* Ícone de seta para voltar */}
                            </button>
                        )}

                        {step < 3 ? (
                            <button
                                type="button"
                                onClick={handleProximo}
                                className="flex items-center text-lg text-[#ea1d2c]"
                            >
                                <span className="material-icons-round cursor-pointer">arrow_forward</span> {/* Ícone de seta para próximo */}
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={handleFinalizar}
                                className="flex items-center text-lg text-[#ea1d2c]"
                            >
                                <span className="material-icons-round">check_circle</span> {/* Ícone para finalizar */}

                            </button>
                        )}
                    </div>
                </form>
                <div className="text-center text-xs text-slate-700 mt-4">
                    <Paragraph text="Já tem uma conta?" className="text-xs inline mb-6 mr-1" />
                    <LinkText href="/auth/login" text="Acesse" className='text-blue-400 text-xs hover:underline' />
                </div>
            </ContainerForm>
        </div>
    );
};


