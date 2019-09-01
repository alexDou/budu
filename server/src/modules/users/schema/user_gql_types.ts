export default `
  enum Gender {
      Male
      Female
  }

  input CreateUserMeetingInput {
    arbitraryName: String
    gender: Gender
    age: Int
    geoposition: String
    phone: String
    roles: UserRelationInput
    photos: UserRelationInput
    meeting_type: UserRelationInput
    open_for: UserRelationInput
    look_for: UserMeetingLookForInput
  }
  
  input UserRelationInput {
    userId: Int!
    value: String!
  }
  
  input UserMeetingLookForInput {
    userId: Int!
    value: UserMeetingLookForDetailsInput
  }
  
  input UserMeetingLookForDetailsInput {
        gender: Gender!
        age: Int!
    }
`;
