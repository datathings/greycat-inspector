import { Form, InputGroup, InputGroupButton, InputGroupAddon, Input, Button } from 'reactstrap';
import * as React from 'react';

class Connect extends React.Component<null, null> {
    render() {
        return (
            <div className="jumbotron jumbotron-fluid">
                <div className="container">
                    <Form>
                        <InputGroup>
                            <InputGroupAddon>GreyCat Gateway</InputGroupAddon>
                            <Input placeholder="ws://localhost:3000/ws" />
                            <InputGroupButton><Button color="info">connect</Button></InputGroupButton>
                        </InputGroup>
                    </Form>
                </div>
            </div>
        );
    }
}

export default Connect;
