import { createContext } from 'react'
import routes from '../routes'

export const RoutesContext = createContext()

export const RoutesProvider = ({ children }) => {
    return (
        <RoutesContext.Provider value={{ routes }}>
            {children}
        </RoutesContext.Provider>
    )
}
