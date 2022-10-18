import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  addDoc,
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
import { toast } from "react-toastify";
import { db } from "../../firebase/config";

export const getBlogList = () => {
  return async (dispatch) => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user !== null) {
      } else {
      }
    });
    const querySnapshot = collection(db, "Blog");
    const data = await getDocs(query(querySnapshot, orderBy("timeStamp")));

    const blogsUser = data.docs.map((blog) => {
      return blog.data()?.uid;
    });

    const getBlogId = data.docs.map((blogId) => {
      return blogId.data()?.id;
    });

    const comments = await getDocs(
      query(collection(db, "Comments"), where("blogId", "in", getBlogId))
    );

    const blogComments = comments.docs.map((comment) => comment.data());

    const users = await getDocs(
      query(collection(db, "users"), where(documentId(), "in", blogsUser))
    );

    const blogUsers = users.docs.map((user) => user.data());

    const commentsData = data.docs
      .map((blog) => {
        const findUser = blogUsers.find(
          (user) => blog?.data()?.uid === user.id
        );
        const findComment = blogComments.filter(
          (comment) => comment.blogId === blog.data().id
        );
        return { ...findUser, comments: findComment, ...blog.data() };
      })
      .sort((a, b) => b.timeStamp - a.timeStamp);
    dispatch({
      type: "BLOG_LIST",
      payload: commentsData,
    });
  };
};

export const addBlogs = ({ title, desc, userId }) => {
  return async (dispatch) => {
    if (title === "" || desc === "") {
      alert("Please Fill The Details");
    } else {
      addDoc(collection(db, "Blog"), {
        title: title,
        description: desc,
        timeStamp: Date.now(),
        uid: userId,
      }).then((docResponse) => {
        const docRef = doc(db, "Blog", docResponse?.id);
        updateDoc(docRef, {
          id: docResponse?.id,
          views: 0,
          likes: [],
        })
          .then(() => {
            dispatch({
              type: "ADD_BLOG",
              payload: {
                title: title,
                description: desc,
                timeStamp: Date.now(),
                uid: userId,
                id: docResponse?.id,
              },
            });
          })
          .catch((err) => {
            toast.error(err);
          });
      });
      toast.success("Blog Added Successfully");
    }
  };
};

export const likeBlogs = ({ id, userId }) => {
  return async (dispatch) => {
    const docRef = doc(db, "Blog", id);
    const docSnap = await getDoc(docRef);
    const currentLikes = docSnap.data()?.likes;

    if (!currentLikes.includes(userId)) {
      updateDoc(docRef, {
        likes: [...currentLikes, userId],
      })
        .then(() => {
          //   dispatch({
          //     type: "LIKE_BLOG",
          //     payload: {
          //       likes: [...currentLikes, userId],
          //     },
          //   });
        })
        .catch((err) => {});
    } else {
      const removedLikes = currentLikes.filter((item) => item !== userId);
      updateDoc(docRef, {
        likes: [...removedLikes],
      })
        .then(() => {
          //   dispatch({
          //     type: "LIKE_BLOG",
          //     payload: {
          //       likes: [...currentLikes],
          //     },
          //   });
        })
        .catch((err) => {});
    }
  };
};