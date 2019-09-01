BUDU core concept
=====================
Account (AID, Firstname, Lastname, Gender, Age, GeoPosition, Photos, Anything, TS-updated, TS-created)
Favorite (FID, AID, age, position, TS-updated)
Invite (IID, fromAID, toAID, type, Datetime, Place, Accept, TS-sent)
Dating (DID, mAID, wAID, IID, Status)
Review (RID, AID, DID, Review, Grade, Public, TS-updated, TS-added)
Leaderboard (LID, AID, Score, Period, TS-created)


in POC list user accounts to logged in user. show women to men, and vice versa.
let user send invite, let receiving party accept/decline invite.
let receiving party suggest another date, place.
once meeting accepted, expect reviews from both parties.
based on reviews calculate ratings and leaderboards.
