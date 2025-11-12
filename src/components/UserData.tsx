import React, { useEffect, useState } from "react";
import { apiUrl, Service } from "@hex-labs/core";
import {
  Button,
  SimpleGrid,
  Text,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Box,
} from "@chakra-ui/react";
import axios from "axios";
import UserCard from "./UserCard";

enum SortBy {
  FIRST = "first",
  LAST = "last"
}

interface User {
  userId: string;
  name: {
    first: string;
    last: string;
  };
  email: string;
  phoneNumber?: string;
}

const UserData: React.FC = () => {

  // The useState hook is used to store state in a functional component. The
  // first argument is the initial value of the state, and the second argument
  // is a function that can be used to update the state. The useState hook
  // returns an array with the first element being the state and the second
  // element being the function to update the state.

  const [users, setUsers] = useState<any[]>([]);
  const [modalUser, setModalUser] = useState<User | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  // The useEffect hook basicaly runs the code inside of it when the component
  // mounts. This is useful for making API calls and other things that should
  // only happen once when the component is loaded.

  useEffect(() => {

    // This is an example of an async function. The async keyword tells the
    // function to wait for the axios request to finish before continuing. This
    // is useful because we can't use the data from the request until it is
    // finished.

    const getUsers = async () => {


      // builds url endpoint at users/hexlabs for the USERS service
      const URL = apiUrl(Service.USERS, "users/hexlabs");

      // fetches data using axios from the URL
      const { data } = await axios.get(URL);

      setUsers(data);
    };
    document.title = "Hexlabs Users"
    getUsers();
  }, []);
  // ^^ The empty array at the end of the useEffect hook tells React that the
  // hook should only run once when the component is mounted. If you want it to
  // run every time a variable changes, you can put that variable in the array
  // and it will run every time that variable changes.

  const openUserModal = (user: User) => {
    setModalUser(user);
    onOpen();
  }

  const sortByName = (field: SortBy) => {
    const sortedUsers = [...users].sort((a, b) => {
      const lastA = a.name?.[field]?.toLowerCase() || "";
      const lastB = b.name?.[field]?.toLowerCase() || "";
      return lastA.localeCompare(lastB);
    });
    setUsers(sortedUsers);
  };



  return (
    <>
      <Text fontSize="4xl">Hexlabs Users</Text>
      <Text fontSize="2xl">This is an example of a page that makes an API call to the Hexlabs API to get a list of users.</Text>
      <Button colorScheme="blue" onClick={() => sortByName(SortBy.FIRST)}>
        Sort by first name
      </Button>
      <Button colorScheme="blue" onClick={() => sortByName(SortBy.LAST)}>
        Sort by last name
      </Button>
      <SimpleGrid columns={[2, 3, 5]} spacing={6} padding={10}>

        {/* Here we are mapping every entry in our users array to a unique UserCard component, each with the unique respective
        data of each unique user in our array. This is a really important concept that we use a lot so be sure to familiarize
        yourself with the syntax - compartmentalizing code makes your work so much more readable. */}
        { users.map((user) => (
          <Box key={user.userId} onClick={() => openUserModal(user)}>
            <UserCard user={user} />
          </Box>
        ))}

      </SimpleGrid>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
       <ModalOverlay />
       <ModalContent>
        <ModalHeader>User Details</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
            {modalUser ? (
              <>
                <Text fontWeight="bold">
                  {modalUser.name.first} {modalUser.name.last}
                </Text>
                <Text>Email: {modalUser.email}</Text>
                {modalUser.phoneNumber && (
                  <Text>Phone: {modalUser.phoneNumber}</Text>
                )}
              </>
            ) : (
              <Text>No user selected.</Text>
            )}
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
       </ModalContent>
      </Modal>
    </>
  );
};

export default UserData;