import MainWrapper from "@components/MainWrapper"
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";

const Service = () => {
  return (
    <MainWrapper>
      <Container className={"pt-3"}>
          <div className={"text-center"}>
              <h1 className={"pb-3"}>Услуги</h1>
          </div>

              <Row className={"py-5"}>
                  <Col sm={4} className={"p-2 text-center"}>
                      <img src={"https://via.placeholder.com/200"} className={"pb-4"}/>
                      <div className={"d-flex flex-column"}>
                          <h4>Сопровождение</h4>
                          <p>Есть над чем задуматься: интерактивные прототипы призывают нас к новым свершениям,
                              которые, в свою очередь, должны быть обнародованы.</p>
                      </div>

                  </Col>
                  <Col sm={4} className={"p-2 text-center"}>

                      <img src={"https://via.placeholder.com/200"} className={"pb-4"}/>
                      <div className={"d-flex flex-column"}>
                          <h4>Внедрение</h4>
                          <p>В целом, конечно, глубокий уровень погружения не даёт нам иного выбора, кроме
                              определения вывода текущих активов.</p>
                      </div>
                  </Col>

                  <Col sm={4} className={"p-2 text-center"}>
                      <img src={"https://via.placeholder.com/200"} className={"pb-4"}/>
                      <div className={"d-flex flex-column"}>
                          <h4>Восстановление</h4>
                          <p>Равным образом, сплочённость команды профессионалов говорит о возможностях
                              переосмысления внешнеэкономических политик.</p>
                      </div>
                  </Col>
              </Row>
            <Row>
                <Col sm={6}>

                </Col>
                <Col sm={6}>

                </Col>
            </Row>
          <Row className={"pb-4"}>
              <Col sm={6} className={"d-flex align-items-center"}>
                  <div>
                      <h3>Продажа и настройка программных продуктов 1С</h3>
                  </div>
              </Col>
              <Col sm={6}>
                  <div>
                      <img src={"https://via.placeholder.com/400"}/>
                  </div>
              </Col>
          </Row>
          <Row className={"pb-4"}>
              <Col sm={6}>
                  <div>
                      <img src={"https://via.placeholder.com/400"}/>
                  </div>
              </Col>
              <Col sm={6} className={"d-flex align-items-center"}>
                  <div>
                      <h3>Продажа антивирусных и программных продуктов делового назначения</h3>
                  </div>
              </Col>
          </Row>
      </Container>
    </MainWrapper>
  )
}

export default Service