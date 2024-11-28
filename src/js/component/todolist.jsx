import React, { useState, useEffect } from "react";

const TodoList = () => {
    const [need, setNeed] = useState([]);

    const getData  = async () => {
        const response = await fetch('https://playground.4geeks.com/todo/users/Yohebyth');
        if (response.ok) {
            const responseJson = await response.json();
            const serverNeeds = responseJson.todos;
            setNeed(serverNeeds);
        } else {
            console.log('error: ', response.status, response.statusText);
            return {error: {status: response.status, statusText: response.statusText}};
        };
    };

    useEffect(()=>{        
        getData()
    },[]);

    const postNeed = async(needParam) => {
        await fetch('https://playground.4geeks.com/todo/todos/Yohebyth', {
            method: 'POST',
            body: JSON.stringify ({
                "label": needParam,
                "is_done": false
            }),
            headers: {
                'content-type': 'application/json' 
            }
        })
        .then(resp => resp.json())
        .then(respJson => {           
            const newNeeds =[...need, respJson];
            setNeed([...newNeeds])
        });
    }

    const handleOnChange = (e) => {
        if (e.key === "Enter") {        
            const yaExiste = need.find(needParam => needParam === e.target.value.trim())  
            if (e.target.value.trim() !== "" && yaExiste === undefined) {
                postNeed(e.target.value.trim());
                e.target.value = "";
            } else alert("The field cannot be empty, nor can the value be repeated.");
        }
    }
    const deleteNeed = (needParam) =>{
        setNeed((previeus) => {
            const newArray = previeus.filter(element => element !== needParam)
            return [...newArray];
        })
    }    
       
    return (
        <div className="container">
            <h1>To Do List</h1>
            <div className="list">
                <input className="input" type="text" placeholder="What needs to be done? " onKeyDown={handleOnChange} />
                <ul>
                    {
                        need.map((needParam) => {
                            return(
                                <li key={needParam.id}>
                                    {needParam.label}
                                    <button
                                        className="delete"
                                        onClick={() => {deleteNeed(needParam);}}
                                    >
                                        <i className="fa-solid fa-x" />
                                    </button>
                                </li>   
                            )
                        })
                    }
                </ul>
                <p>{need.length} {need.length > 1 ? "items left" : "item left"}</p>                
            </div>
            <button 
                type="button" 
                className="btn btn-success"
                onClick={() => {setNeed([])}}>
                    Delete All
            </button>
        </div>
    )
}

export default TodoList;