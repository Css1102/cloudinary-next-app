import { SignIn } from '@clerk/nextjs'

export default function Page(){
  return (
 <div className='dark min-h-screen bg-gradient-to-b from-slate-900 pl-12 to-slate-800 text-base-content flex justify-center items-center py-32 '>
  <SignIn />
  </div>
)

}
