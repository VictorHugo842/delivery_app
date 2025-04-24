'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import Input from '../components/input';
import Button from '../components/button';
import Title from '../components/title';
import Paragraph from '../components/paragraph';
import ContainerForm from '../components/container_form';
import CheckboxText from '../components/checkbox_text';

export default function PaginaRegistro() {
    const [step, setStep] = useState(1);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [opcoesSelecionadas, setOpcoesSelecionadas] = useState<string[]>([]);

    const { control, handleSubmit, watch, getValues, trigger, formState: { errors, isSubmitted } } = useForm({
        defaultValues: {
            nomeUsuario: '',
            email: '',
            telefone: '',
            nomeLoja: '',
            tipoEstabelecimento: '',
            faturamentoMensal: '',
            senha: '',
            confirmarSenha: '',
        }
    });

    const handleCheckboxChange = (opcao: string) => {
        setOpcoesSelecionadas(prev =>
            prev.includes(opcao) ? prev.filter(item => item !== opcao) : [...prev, opcao]
        );
    };

    const camposValidos = [
        "nomeUsuario",
        "email",
        "telefone",
        "nomeLoja",
        "tipoEstabelecimento",
        "faturamentoMensal",
        "senha",
        "confirmarSenha"
    ] as const;  // Isso garante que o tipo seja o literal de cada valor, e não apenas 'string'

    type CamposValidos = typeof camposValidos[number]; // Tipo com os valores literais dos campos

    const handleProximo = async () => {
        let camposParaValidar: CamposValidos[] = [];

        if (step === 1) {
            camposParaValidar = ["nomeUsuario", "email", "telefone"];
        } else if (step === 2) {
            camposParaValidar = ["nomeLoja", "tipoEstabelecimento", "faturamentoMensal"];
        }

        const valido = await trigger(camposParaValidar);

        if (valido) {
            setStep(step + 1);
        }
    };

    const handleFinalizar = async () => {
        const valido = await trigger(["senha", "confirmarSenha"]);

        if (valido) {
            onSubmit(getValues());
        }
    };

    const handleVoltar = () => {
        if (step > 1) {
            setError('');
            setStep(step - 1);
        }
    };

    const onSubmit = async (data: any) => {
        setError('');
        setSuccess('');

        try {
            const payload = {
                nome_loja: data.nomeLoja,
                telefone: data.telefone,
                nome_usuario: data.nomeUsuario,
                email: data.email,
                tipo_estabelecimento: data.tipoEstabelecimento,
                faturamento_mensal: data.faturamentoMensal,
                senha: data.senha,
                confirmar_senha: data.confirmarSenha,
            };

            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/painel/registrar`,
                payload,
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true,
                }
            );

            setSuccess('Registro realizado com sucesso!');
            console.log('Registro bem-sucedido:', response.data);
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                setError(error.response?.data?.msg || 'Erro ao registrar usuário');
            } else {
                setError('Erro inesperado: ' + error.message);
            }
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <ContainerForm>
                <Title text="Crie sua conta" />
                <Paragraph
                    text={step === 1 ? 'Fala um pouco sobre você.' : step === 2 ? 'Queremos conhecer seu negócio.' : 'Defina sua senha.'}
                    className='mb-6'
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
                                render={({ field }) => <Input label="Telefone" type="tel" placeholder="Digite seu telefone" {...field} error={errors.telefone} />}
                            />
                        </>
                    )}

                    {/* Etapa 2 */}
                    {step === 2 && (
                        <>
                            <Controller
                                name="nomeLoja"
                                control={control}
                                rules={{ required: 'Nome da loja é obrigatório' }}
                                render={({ field }) => <Input type="text" label="Nome da Loja" placeholder="Digite o nome da loja" {...field} error={errors.nomeLoja} />}
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
                                            { value: 'comida oriental', label: 'Comida Oriental' }
                                        ]}
                                        {...field}
                                        error={errors.tipoEstabelecimento}
                                    />
                                )}
                            />

                            <Paragraph text="Como você trabalha hoje?" className="font-medium mb-2" />
                            <div className="mb-6">
                                {["Retirada no local", "Entregas delivery", "Emissão de nota fiscal"].map((opcao) => (
                                    <CheckboxText
                                        key={opcao}
                                        checked={opcoesSelecionadas.includes(opcao)}
                                        onChange={() => handleCheckboxChange(opcao)}
                                        label={opcao}
                                        className="mb-3"
                                    />
                                ))}
                            </div>

                            <Controller
                                name="faturamentoMensal"
                                control={control}
                                rules={{ required: 'Faturamento mensal é obrigatório' }}
                                render={({ field }) => (
                                    <Input
                                        label="Faturamento mensal"
                                        type="select"
                                        options={[
                                            { value: 'ate-5000', label: 'até 5 mil' },
                                            { value: '5000-15000', label: '5 a 15 mil' },
                                            { value: '15000-30000', label: '15 a 30 mil' },
                                            { value: '30000-60000', label: '30 a 60 mil' },
                                            { value: 'mais-60000', label: '+ de 60 mil' }
                                        ]}
                                        {...field}
                                        error={errors.faturamentoMensal}
                                    />
                                )}
                            />
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
                                        message: 'A senha precisa ter pelo menos 6 caracteres'
                                    }
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
                                        value === watch('senha') || 'As senhas não coincidem'
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
                            <Button type="button" text="Voltar" onClick={handleVoltar} className="bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded-lg" />
                        )}

                        {step < 3 ? (
                            <Button type="button" text="Próximo" onClick={handleProximo} className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg" />
                        ) : (
                            <Button
                                type="button"
                                text="Finalizar"
                                onClick={handleFinalizar}
                                className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg"
                            />)}
                    </div>
                </form>
            </ContainerForm>
        </div>
    );
}