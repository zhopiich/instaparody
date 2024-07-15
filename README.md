# Instaparody

An Instagram clone integrated with a clone of Twitter's direct messages

## Overview

Create new posts with attached photos, and like, save, or comment on posts just like on Instagram.
Send private messages to your contacts just as on Twitter.

![](https://firebasestorage.googleapis.com/v0/b/instagram-clone-d67da.appspot.com/o/readme%2Fhome.jpeg?alt=media&token=d10173ec-3d14-43b7-9951-0b7c64de9223)

![](https://firebasestorage.googleapis.com/v0/b/instagram-clone-d67da.appspot.com/o/readme%2Fmobiles.png?alt=media&token=cae753d2-010b-4d02-b94f-13a29fd00528)

### Live demo: https://

## Features

#### Drag and drop photos to include them in your post

![](https://firebasestorage.googleapis.com/v0/b/instagram-clone-d67da.appspot.com/o/readme%2Fpost.gif?alt=media&token=7e00e841-a638-4a20-a68b-bbc98a794196)

#### Edit or delete your posts

![](https://firebasestorage.googleapis.com/v0/b/instagram-clone-d67da.appspot.com/o/readme%2Fedit.gif?alt=media&token=8a66441c-1ffc-4cbc-b484-67a7fa6b2d7f)

#### Like, save, or leave comments on any post

![](https://firebasestorage.googleapis.com/v0/b/instagram-clone-d67da.appspot.com/o/readme%2Fcomment.gif?alt=media&token=231667af-4530-4ac7-8497-6c16cda5c2fa)

#### Make contact with other users through their posts, profile page, or by searching for them

![](https://firebasestorage.googleapis.com/v0/b/instagram-clone-d67da.appspot.com/o/readme%2Fcontact.gif?alt=media&token=7a4d453e-dbf1-477e-89aa-7867e20b40d1)

#### Drag and drop a photo to send it with a message to your contacts

![](https://firebasestorage.googleapis.com/v0/b/instagram-clone-d67da.appspot.com/o/readme%2Fsendphoto.gif?alt=media&token=bd35d167-68cb-4bcb-ac67-3b06159279f6)

#### Customize your profile by adding a profile photo, updating your introduction, and selecting your preferences

![](https://firebasestorage.googleapis.com/v0/b/instagram-clone-d67da.appspot.com/o/readme%2Fprofile.gif?alt=media&token=0e1ad974-a644-4c86-a796-cd2c206985e7)

#### Others

- All pages and modals are designed to be responsive across all screen sizes.
- Each profile page, chat with contacts, and post has a unique route path.
- What posts users have saved are kept private. Users cannot see saved posts through the route path, except for their own.
- The subscript under each message you send indicates whether it has been sent or seen by your contact.
- Users who are not involved do not have access to the messages history.
- The alert lasts a few seconds to inform users what was done in success or inappropriately.

## Technique

### Core

- Vue 3
- Vue Router
- Pinia

### Appearance

- Tailwind CSS
- Font Awesome

### Backend Database

#### Firebase 10

- Firestore
- Storage
- Authentication

### Build tool

Vite

### Firestore Database Schema

![](public/readme/schema.svg)

### Directory Structure

```
src
│  App.vue
│  main.js
│  routes.js
│  style.css
│
├─assets
│  │  avatarDefault.png
│  │  base.css
│  │  vue.svg
│  │
│  └─icons
│     sprite.svg
│
├─components
│  │  AvatarLink.vue
│  │  CommentInput.vue
│  │  CommentsList.vue
│  │  DisplayNameLink.vue
│  │  ImageCarousel.vue
│  │  LikesList.vue
│  │  Logo.vue
│  │  NavBar.vue
│  │  NoSuchPost.vue
│  │  PostDetails.vue
│  │  PostImageItem.vue
│  │  PostImageList.vue
│  │  PostItem.vue
│  │  PostItemLoader.vue
│  │  PostList.vue
│  │  Search.vue
│  │  SearchMobile.vue
│  │  SearchResults.vue
│  │  TheAvatar.vue
│  │  TheButton.vue
│  │  TheFooter.vue
│  │  TheIcon.vue
│  │  TheLabel.vue
│  │  TheLayout.vue
│  │  TheModal.vue
│  │  TheTooltip.vue
│  │  UserCard.vue
│  │  UserInfo.vue
│  │  UserPlate.vue
│  │  UserSkeletonLoader.vue
│  │
│  ├─Alert
│  │  Alert.vue
│  │  AlertContent.vue
│  │
│  ├─Messages
│  │  │  Chat.vue
│  │  │  Contacts.vue
│  │  │  ContainerTab.vue
│  │  │  DateTag.vue
│  │  │  DeleteButton.vue
│  │  │  ImagePreview.vue
│  │  │  ImageViewer.vue
│  │  │  MessageBubble.vue
│  │  │  MessageDragAndDrop.vue
│  │  │  MessageInput.vue
│  │  │  Messages.vue
│  │  │  MessagesContainer.vue
│  │  │  MoreButton.vue
│  │  │  MoreMenu.vue
│  │  │  NewMessageIndicator.vue
│  │  │  RepliedBubble.vue
│  │  │  ReplyPreview.vue
│  │  │  SearchPeople.vue
│  │  └──TobottomButton.vue
│  │
│  ├─NavBar
│  │      LoginButton.vue
│  │      NavBarMobile.vue
│  │      NavBarSliding.vue
│  │      ProfileIconMenu.vue
│  │
│  ├─PostButtons
│  │      CommentButton.vue
│  │      ConfirmModal.vue
│  │      LikeButton.vue
│  │      LikesCountBanner.vue
│  │      PostEdit.vue
│  │      postMoreButton.vue
│  │      postMoreMenu.vue
│  │      SaveButton.vue
│  │      TimeBanner.vue
│  │
│  ├─PostUpload
│  │      AlertBanner.vue
│  │      ConfirmDiscardPost.vue
│  │      DragAndDropInput.vue
│  │      InputAlert.vue
│  │      PostUpload.vue
│  │
│  └─ProfileEditing
│         ChangePhoto.vue
│         ChangePhotoMenu.vue
│         DropdownMenu.vue
│         GenderSelect.vue
│         IntroInput.vue
│         TheUploadBtn.vue
│
├─firebase
│      auth.js
│      firebase.js
│      firestore.js
│      storage.js
│
├─modules
│      position.js
│
├─pages
│      ChangePasswordPage.vue
│      CommentsPage.vue
│      HomePage.vue
│      LikesPage.vue
│      LoginPage.vue
│      MessagesPage.vue
│      NotAvailablePage.vue
│      PostDetailsPage.vue
│      ProfileEditingPage.vue
│      ProfilePage.vue
│      SearchPage.vue
│      SignUpPage.vue
│
├─stores
│      alert.js
│      comment.js
│      mediaQuery.js
│      message.js
│      post.js
│      user.js
│
└─utils
       date.js
       request.js
       validation.js
```
