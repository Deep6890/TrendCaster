import { useEffect, useState } from "react";
import api from "../services/api";

function Users() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        api.get("/users").then(res => setUsers(res.data));
    }, []);

    return (
        <div>
            {users.map(u => (
                <p key={u.id}>{u.name} ({u.age})</p>
            ))}
        </div>
    );
}

export default Users;
