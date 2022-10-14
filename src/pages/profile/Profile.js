import React, { useEffect, useState } from "react";
import { HiOutlineMail } from "react-icons/hi";
import { MdAlternateEmail } from "react-icons/md";
import profile from "../../Images/profile.png";
import Card from "react-bootstrap/Card";
import { useNavigate, useParams } from "react-router";
import { Button, Container, Modal } from "react-bootstrap";
import {
  collection,
  doc,
  documentId,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import Comments from "../../Components/Comments";
import BlogCard from "../../Components/BlogCard";

const Profile = (props) => {
  const { uid } = useParams();
  const [data, setData] = useState([]);
  const [user, setUser] = useState("");
  const [isLading, setIsLoading] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [commentId, setCommentId] = useState(null);
  const navigate = useNavigate("");

  const getUserData = async () => {
    const blogQuery = collection(db, "Blog");
    const data = await getDocs(
      query(blogQuery, orderBy("timeStamp"), where("uid", "==", uid))
    );

    const blogsUser = data.docs.map((blog) => {
      return blog.data()?.uid;
    });

    const users = await getDocs(
      query(collection(db, "users"), where(documentId(), "in", blogsUser))
    );

    const blogUsers = users.docs.map((user) => user.data());

    const findUser = blogUsers.find((user) => user.id === uid);
    setIsLoading(true);
    setUser(findUser);
  };

  const getAllData = async () => {
    const blogQuery = collection(db, "Blog");
    const data = await getDocs(
      query(blogQuery, orderBy("timeStamp"), where("uid", "==", uid))
    );

    const blogsUser = data.docs.map((blog) => {
      return blog.data()?.uid;
    });

    const getBlogId = data.docs.map((blogId) => {
      return blogId.data()?.id;
    });

    const users = await getDocs(
      query(collection(db, "users"), where(documentId(), "in", blogsUser))
    );

    const comments = await getDocs(
      query(collection(db, "Comments"), where("blogId", "in", getBlogId))
    );

    const blogUsers = users.docs.map((user) => user.data());
    const blogComments = comments.docs.map((comment) => comment.data());

    const blogData = data.docs.map((blog) => {
      const findUser = blogUsers.find((user) => user.id === blog.data().uid);
      const findComment = blogComments.filter(
        (comment) => comment.blogId === blog.data().id
      );
      return { ...findUser, comments: findComment, ...blog.data() };
    });
    setIsLoading(true);
    setData(blogData);
  };

  const handleOpenComments = (id) => {
    setModalShow(true);
    setCommentId(id);
  };

  const handleNavigate = async (id) => {
    const docRef = doc(db, "Blog", id);
    const docSnap = await getDoc(docRef);
    const currentView = docSnap.data()?.views;
    updateDoc(docRef, {
      views: currentView + 1,
    })
      .then((res) => {})
      .catch((err) => {});
    navigate(`/Blog/${id}`);
  };

  useEffect(() => {
    getAllData();
    getUserData();
  }, [uid]);

  if (!isLading) {
    return (
      <React.Fragment>
        <div>
          <p className="text-center">Loading...</p>
        </div>
      </React.Fragment>
    );
  } else {
    return (
      <React.Fragment>
        <div className="profile-inner">
          <Card
            className="card"
            style={{
              border: "none",
              borderBottom: "1px solid #cbc4c4",
              borderRadius: "0px",
            }}
          >
            <Container className="profile">
              <Card.Body>
                <div className="username-div">
                  <Card.Img src={profile}></Card.Img>
                  <Card.Text>
                    <span style={{ fontWeight: "500" }}>
                      <MdAlternateEmail />
                      {user?.displayName}
                    </span>
                  </Card.Text>
                </div>
                <div className="name-div">
                  <Card.Text className="text">Enter Full Name</Card.Text>
                </div>
                <div className="email-div">
                  <Card.Text id="sort-description">
                    {" "}
                    <HiOutlineMail />
                    {user?.email}
                  </Card.Text>
                </div>
                <div className="bio-div">Bio</div>
              </Card.Body>
            </Container>
          </Card>
          <div>
            <Container>
              <div>
                <h1>Posts</h1>
              </div>
            </Container>
          </div>
        </div>
        <div>
          <Container>
            <div>
              <Container className="card">
                {data.map((item) => {
                  var date = new Date(item.timeStamp);
                  return (
                    <div className="cards-inner" key={item?.id}>
                      <div className="cards-inner" key={item?.id}>
                        <BlogCard
                          title={item?.title}
                          name={item?.displayName}
                          description={`${item?.description?.slice(0, 550)}...`}
                          uid={item?.uid}
                          views={item?.views}
                          date={date?.toLocaleString()}
                          id={item?.id}
                          handleNavigate={() => handleNavigate(item?.id)}
                          handleOpenComments={() =>
                            handleOpenComments(item?.id)
                          }
                          liked={item?.likes?.includes(uid)}
                          commentsLength={item?.comments?.length}
                          likes={item?.likes?.length}
                          showEditDeleteButton={false}
                          getAllData={getAllData}
                        />
                      </div>
                    </div>
                  );
                })}
              </Container>
            </div>
          </Container>
        </div>
        {/* Modal Code Start */}

        <Modal
          show={modalShow}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Comments id={commentId} getAllData={getAllData} />
          <Modal.Footer>
            <Button show={modalShow} onClick={() => setModalShow(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
        {/* Modal Code End */}
      </React.Fragment>
    );
  }
};

export default Profile;
