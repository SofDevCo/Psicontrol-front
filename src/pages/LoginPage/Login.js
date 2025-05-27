import LogoCubeUp from '../../pages/LoginPage/images/logo-cube-up.png';
import ButtonLoginGoogle from '../../pages/LoginPage/images/button-login-google.png';
import MokckupLogin from '../../pages/LoginPage/images/mockup-login.png';

const Login = () => {
  const handleLogin = () => {
    const stateObj = { action: 'login' };
    const state = encodeURIComponent(JSON.stringify(stateObj));
    window.location.href = `${process.env.REACT_APP_API_URL}/auth/google?state=${state}`;
  };

  return (
    <section>
      <div className="relative flex h-[250px] flex-col items-center justify-center">
        <img src={LogoCubeUp} alt="Logo" className="w-60" />
      </div>

      <div className="relative flex h-[627px] w-full flex-col items-center rounded-tl-[40px] bg-[#DBE9F9]">
        <p className="pt-10 text-3xl font-semibold text-center w-80 font-raleway text-primaria">
          Entre e experimente uma nova rotina
        </p>
        <p className="pt-2 font-light font-fustat">
          Gestão leve e organizada com o Psicontrol
        </p>
        <div>
          <button onClick={handleLogin}>
            <img
              src={ButtonLoginGoogle}
              alt="Login com Google"
              className="mt-10 bg-white rounded-lg w-80 drop-shadow-lg"
            />
          </button>{' '}
        </div>
        <p>
          Ainda não tem cadastro?{' '}
          <a
            className="font-bold"
            href="https://www.psicontrol.com.br/register"
            target="_blank"
            rel="noopener noreferrer"
          >
            clique aqui!
          </a>
        </p>
        <div>
          <img
            src={MokckupLogin}
            alt="Login com Google"
            className="mt-10 rounded-lg w-80"
          />
        </div>
        <p className="text-sm text-center w-80 text-texto2">
          Tudo isso sem complicações, sem burocracia e sem precisar instalar
          nada.
        </p>
      </div>
    </section>
  );
};

export default Login;
