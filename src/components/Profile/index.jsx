import React from 'react';
import {
  Button,
  Figure,
  Container,
  Row,
  Col,
  Jumbotron,
} from 'react-bootstrap';

const Profile = () => (
  <div className="page profile">
    <div className="mainview">
      <div>
        <Jumbotron>
          <Container>
            <Row>
              <Col xs={12} sm={8}>
                <h1> TP Henson</h1>

                <p>
                  Taraji Penda Henson was born on September 11, 1970, in Washington, D.C.
                  She landed her first professional acting gig on Smart Guy. In
                  2001 she got her big break in the film Baby Boy. Her
                  performance led to the role of Shug in Hustle and Flow and in
                  2008 she earned an Oscar nomination for her part in The
                  Curious Case of Benjamin Button. Henson went on to appear in
                  such films as Think Like a Man (2012) and also starred in the
                  television drama Person of Interest from 2011 to 2013. In 2015
                  Henson took on the role of Cookie Lyon in the hit series
                  Empire, earning a Golden Globe for the part. Her later films
                  include the critically acclaimed Hidden Figures (2016) and
                  What Men Want (2019).
                </p>
              </Col>
              <Col xs={6} sm={4}>
                <Figure>
                  <Figure.Image
                    rounded
                    width={500}
                    height={500}
                    alt="1"
                    src="https://fsi-live.s3.us-west-1.amazonaws.com/s3fs-public/rsd16_073_0295a.jpg"
                  />

                  <Figure.Caption>
                    <Button variant="primary" size="lg" block>
                      Edit Profile
                    </Button>
                  </Figure.Caption>
                </Figure>
              </Col>
            </Row>
          </Container>
        </Jumbotron>
      </div>
    </div>
  </div>
);

export default Profile;
