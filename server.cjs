const express = require('express');
const soap = require('soap');
const path = require('path');
const app = express();
const port = 3000;

const users = {
    '1': { id: 1, name: 'John Doe', email: 'john.doe@example.com' },
    '2': { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com' },
    '3': { id: 3, name: 'Emily Johnson', email: 'emily.johnson@example.com' }
};

const wsdlDefinition = `
<definitions name="UserService"
    targetNamespace="http://www.example.com/"
    xmlns:tns="http://www.example.com/"
    xmlns:xsd="http://www.w3.org/2001/XMLSchema"
    xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
    xmlns:wsdl="http://schemas.xmlsoap.org/wsdl/">

    <message name="GetUserRequest">
        <part name="userId" type="xsd:string"/>
    </message>

    <message name="GetUserResponse">
        <part name="user" type="xsd:string"/>
    </message>

    <portType name="UserPortType">
        <operation name="GetUser">
            <input message="tns:GetUserRequest"/>
            <output message="tns:GetUserResponse"/>
        </operation>
    </portType>

    <binding name="UserBinding" type="tns:UserPortType">
        <soap:binding transport="http://schemas.xmlsoap.org/soap/http"/>
        <operation name="GetUser">
            <soap:operation soapAction="http://www.example.com/GetUser" style="rpc"/>
            <input>
                <soap:body use="literal" namespace="http://www.example.com/"/>
            </input>
            <output>
                <soap:body use="literal" namespace="http://www.example.com/"/>
            </output>
        </operation>
    </binding>

    <service name="UserService">
        <port name="UserPort" binding="tns:UserBinding">
            <soap:address location="http://localhost:3000/soap"/>
        </port>
    </service>
</definitions>
`;

const service = {
    UserService: {
        UserPort: {
            GetUser: function(args) {
                const userId = args.userId;
                const user = users[userId];
                if (user) {
                    return {
                        user: JSON.stringify(user)
                    };
                } else {
                    return {
                        user: 'User not found'
                    };
                }
            }
        }
    }
};

app.use(express.static('public'));

app.listen(port, () => {
    soap.listen(app, '/soap', service, wsdlDefinition);
    console.log(`SOAP server is running at http://localhost:${port}/soap`);
});
