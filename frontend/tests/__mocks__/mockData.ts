
export const mockUserData = [
    {
      id: 1,
      name: 'John Doe',
      avatar: 'https://example.com/avatar.jpg',
    },
    {
      id: 2,
      name: 'Jane Smith',
      avatar: '',
    },
  ];
  
  export const mockGroupData = [
    {
      id: 1,
      name: 'Group A',
      avatar: '',
    },
    {
      id: 2,
      name: 'Group B',
      avatar: 'https://example.com/group-avatar.jpg',
    },
  ];

  // __mocks__/mockData.ts
export const mockMessageData = [
    {
      senderId: 1,
      recipientId: 2,
      content: 'Hello',
      fileUrl: null,
    },
    {
      senderId: 2,
      recipientId: 1,
      content: 'Hi there',
      fileUrl: 'https://example.com/file.jpg',
    },
  ];
  
  export const mockGroupMessageData = [
    {
      senderId: 1,
      groupId: 1,
      content: 'Group message 1',
      fileUrl: null,
    },
    {
      senderId: 2,
      groupId: 1,
      content: 'Group message 2',
      fileUrl: 'https://example.com/groupfile.jpg',
    },
  ];
  
  