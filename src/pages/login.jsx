export default function LoginPage() {
    return (
       <div className="w-full h-screen bg-slate-400 flex items-center justify-center">
        <div className="w-[500px] h-[500px] bg-slate-600 flex flex-col justify-center items-center ">
            <img src="/logo.jpge.jpg" alt="" className="rounded-full w-[100px]"/>
            <span>Email</span>
            <input type="text" />
            <span>Password</span>
            <input type="password" />
            <button className="bg-white">Login</button>
        </div>
       </div>
    );
}
