import RegisterForm from '@/features/register/components/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen w-full overflow-hidden bg-white dark:bg-background-dark">
      <div className="hidden lg:flex lg:w-1/2 bg-[url('/login%20and%20register.png')] bg-cover bg-center relative">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute bottom-12 left-12 right-12 text-white">
          <h2 className="text-3xl font-bold leading-tight mb-3">Únete a la revolución del residuo cero.</h2>
          <p className="text-lg opacity-90 max-w-md">Cada ingrediente cuenta. Ayudamos a miles de hogares a reducir el desperdicio de comida de forma inteligente.</p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col justify-center p-6 sm:p-12 md:p-20 bg-white dark:bg-background-dark">
        <RegisterForm />
      </div>
    </div>
  );
}
