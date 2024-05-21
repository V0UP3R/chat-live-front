'use client'

import { Button, Input } from "@nextui-org/react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import Image from 'next/image'
import { FaEye } from "react-icons/fa"
import { IoMdEyeOff } from "react-icons/io"
import {NextUIProvider} from "@nextui-org/react";

export default function SignInPage() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await signIn('credentials', {
        redirect: false,
        email,
        password,
      })

      console.log('[LOGIN_RESPONSE]: ', response)

      if (!response?.error) {
        router.refresh()
        router.push('/chat/lobby')
      } else {
        setError('Email ou senha inválidos')
      }
    } catch (error) {
      console.log('[LOGIN_ERROR]: ', error)
    }
  }

  return (
    <NextUIProvider>
    <div className='w-full h-screen flex items-center justify-center bg-blue-900'>
      <form className='p-10 rounded-lg w-96 md:bg-gray-100 flex flex-col items-center md:shadow-[0_35px_60px_-15px_rgba(0,0,0,0.6)]' onSubmit={handleLogin}>
        <div className="w-full flex items-center justify-center">
        </div>
        <h1 className='text-3xl font-bold mb-4 text-white md:text-gray-700'>Login</h1>
        <p className='text-sm text-white md:text-slate-700 mb-10'>Faça login para continuar</p>
        <div className='flex flex-col'>
          <div className='flex flex-col w-full gap-1 mb-6'>
            <Input
              label="E-mail"
              type="email"
              name="email"
              variant="bordered"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full"
              classNames={{
                inputWrapper: ["border border-gray-400 border-solid"],
                base:["bg-white", "rounded-xl"]
              }}
            />
          </div>
          <div className='flex flex-col gap-1 mb-6'>
            <Input
              label="Senha"
              name="password"
              variant="bordered"
              onChange={(e) => setPassword(e.target.value)}
              endContent={
                <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                  {isVisible ? (
                    <FaEye  className="text-2xl text-default-400 pointer-events-none" />
                  ) : (
                    <IoMdEyeOff  className="text-2xl text-default-400 pointer-events-none" />
                  )}
                </button>
              }
              type={isVisible ? "text" : "password"}
              width={'100%'}
              classNames={{
                inputWrapper: ["border border-gray-400 border-solid"],
                base:["bg-white", "rounded-xl"]
              }}
            />
          </div>
          {error && <span className="text-red-400 text-sm block mt-2">{error}</span>}
          <Button
            type='submit'
            className='mt-10 bg-gray-700 text-slate-50 p-3 rounded'
          >
            Entrar
          </Button>
        </div>
      </form>
    </div>
    </NextUIProvider>
  )
}
