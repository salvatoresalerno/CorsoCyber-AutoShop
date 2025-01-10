import { loadUserList } from "../../action";





export default async function GestioneUtenti() {

    const { data, error } = await loadUserList();

    console.log('Lista Utenti: ', data)

    return (
        <div>Pagina utenti</div>
    )
}