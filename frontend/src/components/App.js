import '../index.css';
import Header from './Header';
import Main from './Main';
import ImagePopup from "./ImagePopup";
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import { useEffect, useState } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import { api } from '../utils/api';
import auth from '../utils/auth';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import Login from './Login';
import Register from './Register';
import ProtectedRoute from './ProtectedRoute';
import Footer from './Footer';
import InfoTooltip from './InfoTooltip';


function App() {
    const token = localStorage.getItem('token');
    const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
    const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
    const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
    const [isInfooTooltipOpen, setIsInfooTooltipOpen] = useState(false);
    const [selectedCard, setSelectedCard] = useState({ name: '', link: '' });
    const [currentUser, setCurrentUser] = useState({
      name: '',
      about: ''
    });
    const [cards, setCards] = useState([]);
    const [email, setEmail] = useState('');
    const [loggedIn, setLoggedIn] = useState(false);
    const [successRegistration, setSuccessRegistration] = useState(false);
    const history = useHistory();

    useEffect(() => {
      const token = localStorage.getItem('token');
      if (token) {
        api.getUserInfo(token)
          .then(res => {
            setCurrentUser(res);
          })
          .catch((err) => console.log(err));
          
        api.getInitialCards(token)
          .then(res => {
            setCards(res);    
          })
          .catch((err) => console.log(err));
    }
    }, [loggedIn]);

    
    function handleCardLike(card) {
        const isLiked = card.likes.some((like) => like === currentUser._id);

        api.changeLikeCardStatus(card._id, !isLiked, token).then((newCard) => {
                setCards((state) => state.map((c) => (c._id === card._id ? newCard : c)));
            })
            .catch((err) => console.log(err));
    }

    function handleCardDelete(removedCard) {
        api.removeCard(removedCard._id, token).then(() => {
          setCards((cards) => cards.filter((card) => card._id !== removedCard._id))
            })
            .catch((err) => console.log(err));
    }


    function handleUpdateAvatar(formData) {
        api.setUserAvatar(formData, token).then((formData) => {
                setCurrentUser(formData);
                closeAllPopups();
            })
            .catch((err) => console.log(err));
    }

    function handleUpdateUser(formData) {
        api.setUserInfo(formData, token).then((formData) => {
                setCurrentUser(formData);
                closeAllPopups();
            })
            .catch((err) => console.log(err));
    }

    function handleAddPlaceSubmit(newCard) {
        api.addCard(newCard, token).then((newCard) => {
                setCards([newCard, ...cards]);
                closeAllPopups();
            })
            .catch((err) => console.log(err));
    }

    function handleCardClick(cardData) {
        setSelectedCard(cardData);
    }

    function handleEditAvatarClick() {
        setIsEditAvatarPopupOpen(true);
    }

    function handleEditProfileClick() {
        setIsEditProfilePopupOpen(true);
    }

    function handleAddPlaceClick() {
        setIsAddPlacePopupOpen(true);
    }

    function closeAllPopups() {
        setIsEditAvatarPopupOpen(false);
        setIsEditProfilePopupOpen(false);
        setIsAddPlacePopupOpen(false);
        setSelectedCard({ name: '', link: '' });
    }

    function onLogin(password, email) {
      auth.login(password, email)
        .then(data => {
          if (data.token) {
            localStorage.setItem('token', data.token);
            setLoggedIn(true);
            setEmail(email);
            history.push('/')
          } else {
            localStorage.removeItem('token');
          }
        })
        .catch(err => {
          setSuccessRegistration(false);
          setIsInfooTooltipOpen(true);
          console.log(err)
        })
    }
  
    function onRegister(password, email) {
      auth.register(password, email)
        .then(data => {
          if (data) {
            setSuccessRegistration(true);
            setIsInfooTooltipOpen(true);
            
          }
        })
        .catch(err => console.log(err));   
    };
  
    function onSignOut() {
      localStorage.removeItem('token');
      setLoggedIn(false);
      history.push('/sign-in');
    };
  
    function onInfooTooltipClose() {
      history.push('/sign-in');
      setIsInfooTooltipOpen(false);
    }
  
    useEffect(() => {
      const token = localStorage.getItem('token');
         if (token) {
        auth.getContent(token)
          .then(res => {
            if (res) {
              setEmail(res.email);
              setLoggedIn(true);
              history.push('/');
            }
          })
          .catch(err => console.log(err));
      }
    }, [history, loggedIn]);

    
    return ( 
      <CurrentUserContext.Provider value={currentUser}>    
        <div className="App"> 
          <Header 
             loggedIn={loggedIn} 
             email={email} 
             onSignOut={onSignOut} 
          />
          
          <Switch>
              <ProtectedRoute exact path='/'
                  loggedIn={loggedIn}
                  cards = { cards }
                  onCardLike = { handleCardLike }
                  onCardDelete = { handleCardDelete }
                  onEditAvatar = { handleEditAvatarClick }
                  onEditProfile = { handleEditProfileClick }
                  onAddPlace = { handleAddPlaceClick }
                  onCardClick = { handleCardClick }
                  component={Main} 
              />
            <Route path='/sign-in' render={() => 
               <Login
                 onLogin={onLogin}
              
                  />} 
               />
            <Route path='/sign-up' render={() => 
               <Register
                 onRegister={onRegister}
                
                  />} 
                />
          </Switch>
          
          <Footer />

          <EditAvatarPopup 
            isOpen = { isEditAvatarPopupOpen }
            onClose = { closeAllPopups }
            onUpdateAvatar = { handleUpdateAvatar }
          />

          <EditProfilePopup 
            isOpen = { isEditProfilePopupOpen }
            onClose = { closeAllPopups }
            onUpdateUser = { handleUpdateUser }
          />

          <AddPlacePopup 
            isOpen = { isAddPlacePopupOpen }
            onClose = { closeAllPopups }
            onAddPlace = { handleAddPlaceSubmit }
          />

          <ImagePopup 
            card = { selectedCard }
            onClose = { closeAllPopups }
          />
           <InfoTooltip 
              isOpen={isInfooTooltipOpen}
              successRegistration={successRegistration}
              onClose={onInfooTooltipClose}
            />

        </div>
       
      </CurrentUserContext.Provider>
    );
}

export default App;