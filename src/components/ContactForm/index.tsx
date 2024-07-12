import { ChevronRight, Xmark } from "@gravity-ui/icons"
import React, {FormEvent, useRef, useState} from "react"
import emailjs from '@emailjs/browser';

interface ContactFormProps {
    setShowContact: (show: boolean) => void;
}

const ContactForm: React.FC<ContactFormProps> = ({setShowContact}) => {

    // eslint-disable-next-line no-control-regex
    const emailPattern = new RegExp(/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/);
    const telPattern = new RegExp(/\d\s\(\d{3}\)\s\d{3}-\d{2}-\d{2}/);

    const [phoneNumber, setPhoneNumber] = useState('')
    const [email, setEmail] = useState('')
    const formatPhoneNumber = (input: string) => {

        const cleaned = input.replace(/\D/g, '');
        let formatted = ''
        if (cleaned.length <= 1) {
            formatted = `${cleaned.substring(0, 1)}`
        } else if (cleaned.length <= 4) {
            formatted = `${cleaned.substring(0, 1)} (${cleaned.substring(1, 4)}`
        } else if (cleaned.length <= 7) {
            formatted = `${cleaned.substring(0, 1)} (${cleaned.substring(1, 4)}) ${cleaned.substring(4, 7)}`
        } else if (cleaned.length <= 9) {
            formatted = `${cleaned.substring(0, 1)} (${cleaned.substring(1, 4)}) ${cleaned.substring(4, 7)}-${cleaned.substring(7, 9)}`
        } else if (cleaned.length <= 11) {
            formatted = `${cleaned.substring(0, 1)} (${cleaned.substring(1, 4)}) ${cleaned.substring(4, 7)}-${cleaned.substring(7, 9)}-${cleaned.substring(9, 11)}`
        }
        return formatted;
    }

    const handlePhoneNumber = (value: string) => {
        setPhoneNumber(formatPhoneNumber(value));
    };

    const form = useRef<HTMLFormElement>(null);
    const sendEmail = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (form.current) {
            emailjs
                .sendForm('service_7l2g07k', 'template_z9epk3l', form.current, {
                    publicKey: 'k1vk1qjkKl9DVnkTd',
                })
                .then(
                    () => {
                        alert('Письмо успешно отправлено!');
                        setShowContact(false)
                    },
                    (error) => {
                        alert('Ошибка в отправке письма.')
                        console.log('Ошибка в отправке письма.', error.text);
                    },
                );
        }
    };

    return (
        <div className='fixed w-screen h-screen z-[100] backdrop-blur-md bg-black/30 top-0'>
            <form ref={form} onSubmit={sendEmail} className='fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-900/70 p-12 rounded-3xl border border-gray-500/50 space-y-6'>
                <div className='flex items-center'>
                    <p className='text-3xl'>Связаться с нами</p>
                    <Xmark className='text-white w-8 h-8 flex-none cursor-pointer ml-auto' onClick={() => setShowContact(false)} />
                </div>
                <div className='space-y-2'>
                    <input type="text" name="from_name" className='w-full bg-gray-900 rounded-lg px-4 py-2 text-slate-300 focus:border-none' placeholder='ФИО' required />
                    <input type="email" name="from_email" defaultValue={email} onChange={(e) => setEmail(e.target.value)} className={`${email.match(emailPattern) ? 'text-green-500' : 'text-pink-500'} w-full bg-gray-900 rounded px-4 py-2 focus:border-none`} placeholder='Email' required />
                    <input type="tel" name="from_tel" className={`${phoneNumber.match(telPattern) ? 'text-green-500' : 'text-pink-500'} w-full bg-gray-900 rounded-lg px-4 py-2 focus:border-none invalid:text-pink-500 invalid:ring invalid:ring-pink-500`} placeholder='Телефон' value={phoneNumber} onChange={(e) => handlePhoneNumber(e.target.value)} required/>
                    <input type="text" name="from_org" className='w-full bg-gray-900 rounded-lg px-4 py-2 text-slate-300 focus:border-none' placeholder='Наименование организации' required />
                    <textarea name="message" className='w-full bg-gray-900 rounded-lg px-4 py-2 text-slate-300 max-h-60' placeholder='Сообщение' required />
                </div>
                <button type='submit' disabled={!(email.match(emailPattern) && phoneNumber.match(telPattern))} className={`disabled:opacity-50 disabled:cursor-not-allowed ml-auto flex items-center px-6 py-2 bg-sky-500 text-slate-50 rounded-full hover:bg-sky-700 transition-all`}>Отправить <ChevronRight /></button>
            </form>
        </div>
    )
}

export default ContactForm;