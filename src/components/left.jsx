import React from "react"
import { useState } from "react"



function Left() {

    const [components, setComponents] = useState([]);

    function addComponent(type) {
        setComponents([...components, { id: Date.now(), type, props: { text: type } }]);
    }

      
    return (
        <div className="left">
            <div className="">
                <button onClick={() => addComponent("Heading")}>Add Heading</button>
                <button onClick={() => addComponent("Paragraph")}>Add Paragraph</button>
                <button onClick={() => addComponent("Section")}>Add Section</button>
            </div>
            {components.map(c => (
                <div key={c.id}>
                    {c.type === "Heading" && <h2>{c.props.text}</h2>}
                    {c.type === "Paragraph" && <p>{c.props.text}</p>}
                    {c.type === "Section" && <div style={{ padding: 10, background: "#ddd" }}>{c.props.text}</div>}
                    
                </div>
                
            ))}

           
        </div>


    )
}

export default Left