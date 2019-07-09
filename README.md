# Promethus
 
Personal Discord Bot

**Future Features**
* Seperate out functions into different js scripts, organize by Route or Helper Functions. 
* Invalidate Bots in assignNight Route
* The first of several Team functionality. (Assign Two team captains, Assign Two teams evenly, Create a tournament structure?)


| Route        | Functionality                                                                                                                        |
|--------------|--------------------------------------------------------------------------------------------------------------------------------------|
| cleanUp      | Used to clean a chat history from having bot messages, currently goes back through the last 100 messages deleteing all bot messages. | 
| assignNight  | Randomly picks one user from within the voice call to be the shot Caller, this is written to a db and cannot be reassigned same day. |
| pickCaptains | Randomly picks two users from withing a voice call to be Team Captains.                                                              |
###### Note: all Routes are preceded by a prefix, default set to '-'
