import { createContext, useState, useEffect } from 'react'
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext()

export default AuthContext;

export const AuthProvider = ({children}) => {

    let [user, setUser] = useState(() => (localStorage.getItem('authTokens') ? jwtDecode(localStorage.getItem('authTokens')) : null))
    let [authTokens, setAuthTokens] = useState(() => (localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null))
    let [loading, setLoading] = useState(true)

    const navigate = useNavigate()

    let loginUser = async (e) => {
        e.preventDefault()
        const response = await fetch('http://127.0.0.1:8000/api/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username: e.target.username.value, password: e.target.password.value })
        });

        let data = await response.json();

        if (data) {
            localStorage.setItem('authTokens', JSON.stringify(data));
            console.log('logged in, response:', data)
            setAuthTokens(data)
            setUser(jwtDecode(data.access))
            navigate('/')
        } else {
            alert('Something went wrong while logging in the user.')
        }
    }

    let registerUser = async (userData) => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/register/', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            const data = await response.json();
            console.log('data sent for registering:', data)

            if (data) {
                localStorage.setItem('authTokens', JSON.stringify(data));
                console.log('registered, data:', data);
                setAuthTokens(data);
                setUser(jwtDecode(data.access));
                navigate('/');
            } else {
                alert('Something went wrong while registration.');
            }
        } catch (error) {
            console.error('Error during registration:', error);
        }
    }

    let logoutUser = (e) => {
//        e.preventDefault()
        console.log('removing tokens from localStorage and logging out')
        localStorage.removeItem('authTokens')
        setAuthTokens(null)
        setUser(null)
        navigate('/login')
    }

    const updateToken = async () => {
        const response = await fetch('http://127.0.0.1:8000/api/token/refresh/', {
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({ refresh : authTokens?.refresh })
        })
        const data = await response.json()

        if (response.status === 200) {
            console.log('updating token, data:', data)
            setAuthTokens(data)
            setUser(jwtDecode(data.access))
            localStorage.setItem('authTokens', JSON.stringify(data))
        } else {
            console.log('not updating token, logging out, data:', data)
            logoutUser()
        }

        if (loading) {
            setLoading(false)
        }
    }

    let contextData = {
        user: user,
        authTokens: authTokens,
        loginUser: loginUser,
        logoutUser: logoutUser,
        registerUser: registerUser,
    }

    useEffect(()=>{
//        if (loading) {
//            updateToken()
//        }

        const REFRESH_INTERVAL = 1000 * 60 * 4
        let interval = setInterval(()=>{
//            if(authTokens){
//                updateToken()
//            }
        }, REFRESH_INTERVAL)
        return () => clearInterval(interval)

    }, [authTokens, loading])

    return(
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    )
}