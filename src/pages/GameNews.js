import { Grid, Container } from 'semantic-ui-react';

import Topics from "../components/Topics";

function GameNews() {
    return (    
    <Container>
        <Grid>
            <Grid.Row>
                <Grid.Column width={3}> <Topics /> </Grid.Column>
                <Grid.Column width={10}>
                   
                </Grid.Column>
                <Grid.Column width={3}>789</Grid.Column>
            </Grid.Row>
        </Grid>
    </Container>
    );
}

export default GameNews;