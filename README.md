# Anonymous Voting System

This is a voting system project made for the Genskill Fullstack Web Development Bootcamp. The question was as follows.

> <br/>
> A website where you can create and share polls. People can anonymously vote on items and you (as the creator of the poll) can view results. The main features are like so
>
> - Registration
>
>   - Sign Up
>   - Sign In
>
> - Poll management
>   - View list of created polls
>   - Create a new poll
>   - Select a poll
>     - Add options to poll
>     - Get share link for a poll
>     - View current votes on the poll
>     - Fix deadline for poll (people will not be able to vote after that).
>
> Registration of users is compulsory for this application
> <br/><br/>

## Structure

The frontend code was developed by [@clifordjoshy](https://github.com/clifordjoshy) and can be found in the current ([frontend](https://github.com/clifordjoshy/voting-system-project/tree/frontend)) branch.

The backend code was developed by [@novumvita](https://github.com/novumvita) and can be found in the [backend](https://github.com/clifordjoshy/voting-system-project/tree/backend) branch.

## Implementation Details

The frontend was created in React using Bootstrap components.

## Running the App

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Deployment

The frontend has been deployed to Netlify and can be found [here](https://votey.netlify.app/)

## Routes

The following routes are present in the app:
| Route | Description |
|----------------------|------------------------------------------|
| / | Home Page |
| /polls/:pollId | For an anonymous user to vote on a poll |
| /admin/create | To create a poll |
| /admin/polls | To see all the polls created by the user |
| /admin/polls/:pollId | To see the results of a poll |
| /admin/edit/:pollId | To edit a poll |
