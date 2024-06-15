import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import bookRequests from "../requests/books";
import userRequests from "../requests/users";
import reviewRequests from "../requests/reviews";
import {
  DeleteButton,
  Notification,
  AddToReadingList,
  ToLoggedIn,
  UpdateComment,
} from "../components";

export const Book = () => {
  const [book, setBook] = useState(null);
  const [bookReviews, setBookReviews] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [user, setUser] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const getBookAndUser = async () => {
      const bookReviews = await reviewRequests.getById(id);
      setBookReviews(bookReviews);
      setBook(bookReviews.book)
      const response = window.localStorage.getItem("user");
      const loggedUser = JSON.parse(response);
      if (!loggedUser) {
        setLoggedInUser(null);
      }
      if (loggedUser) {
        const user = await userRequests.getById(loggedUser.userId);
        setLoggedInUser(user);
        setUser(user);
      }
    };
    getBookAndUser();
  }, []);

  console.log(bookReviews);

  const handleCommentUpdate = async () => {
    try {
      const updatedBook = await bookRequests.getByBookId(id);
      setBook(updatedBook);
    } catch (err) {
      console.error(err);
    }
  };

  if (!book || !user) {
    return <div>Unable to find book</div>;
  }
  if (!loggedInUser) {
    return (
      <div className="pt-24 ps-48 flex flex-col items-start bg-gradient-to-r from-teal-800 via-teal-600 to-teal-400">
        <p>
          <a
            className="hover:text-teal-200 underline"
            href={`/users/${user.id}`}
          >
            {user.username}
          </a>{" "}
          added this book in 2024
        </p>
        <h1 className="pt-10">{book.title}</h1>
        <p className="text-stone-900 font-semibold text-lg">By {book.author}</p>

        <div className="pt-10">
          <p className="font-semibold">
            {user.username} rated this book {book.rating} out of 5
          </p>
          <p className="transition duration-150 place-content-center w-96 p-5 rounded-md border-double border-4 border-teal-600 hover:border-emerald-300 bg-white text-sm text-black">
            {book.comment}
          </p>
        </div>
        <a
          className="py-10 hover:text-teal-200 underline"
          target="_blank"
          rel="noreferrer"
          href={book.url}
        >
          See on the internet
        </a>
      </div>
    );
  }

  const userReview = bookReviews.reviews.find(r => r.userId === loggedInUser.id);
  const bookOfUser = userReview ? true : false;
  console.log(userReview)

  return (
    <div>
      <Notification />
      <ToLoggedIn />
      <div className="bg-gradient-to-r from-teal-800 via-teal-600 to-teal-400 flex flex-row">
        <div className="py-24 ps-48 flex flex-col items-start ">
          <h1 className="pt-10">{book.title}</h1>
          <p className="text-stone-900 font-semibold text-xl">
            By {book.author}
          </p>

          <div className="pt-10">
            {bookOfUser ? (
              <p>You rated this book {userReview.rating} out of 5 </p>
            ) : (
              <p className="font-semibold">
                {user.name} rated this book {userReview.rating} out of 5
              </p>
            )}
            <p className="transition duration-150 place-content-center w-96 p-5 rounded-md border-double border-4 border-teal-600 hover:border-emerald-300 bg-white text-sm text-black">
              {userReview.comment}
            </p>
          </div>

          <a
            className="pt-10 hover:text-teal-200 underline"
            target="_blank"
            rel="noreferrer"
            href={book.url}
          >
            See on the internet
          </a>

          {bookOfUser ? (
            <div className="py-10">
              <DeleteButton userId={loggedInUser.id} reviewId={userReview.id} />
            </div>
          ) : (
            <div className="pt-10">
              <AddToReadingList userId={loggedInUser.id} bookId={book.id} />
            </div>
          )}
        </div>
        {bookOfUser ? (
          <div className="ps-36 pt-80 pb-32">
            <UpdateComment book={userReview} onCommentUpdate={handleCommentUpdate} />
          </div>
        ) : null}
      </div>
    </div>
  );
};
