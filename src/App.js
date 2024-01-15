import { useState } from "react";
import "./index.css";

export default function App() {
  const [friends, setFriends] = useState([]);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleAddFriend(newFriend) {
    setFriends((friends) => [...friends, newFriend]);
    setShowAddFriend(false);
  }

  function handleShowAddFriend() {
    setShowAddFriend((s) => !s);
  }

  function handleSelectedFriend(friend) {
    setSelectedFriend((cur) => (cur?.id === friend.id ? null : friend));
    setShowAddFriend(false);
  }

  function handleSplitBill(value){
    console.log(value);
    setFriends(friends.map((friend) => friend.id === selectedFriend.id ? {...friend, balance: friend.balance + value}: friend));
    setSelectedFriend(null);
  }

  return (
    <div className="app">
      <div className="sidebar">
        {friends.length > 0 && (
          <FriendsList
            selectedFriend={selectedFriend}
            onSelection={handleSelectedFriend}
            friends={friends}
          />
        )}
        {showAddFriend && <AddFriend onAddFriends={handleAddFriend} />}
        <Button
          onClick={handleShowAddFriend}
          text={showAddFriend ? "Close" : "Add Friend"}
        />
      </div>
      {selectedFriend && <MainForm onSplitBill={handleSplitBill} selectedFriend={selectedFriend} />}
    </div>
  );
}

function FriendsList({
  friends,
  onShowSplitForm,
  onSelection,
  selectedFriend,
}) {
  return (
    <ul>
      {friends.map((f) => (
        <Friend
          onShowSplitForm={onShowSplitForm}
          onSelection={onSelection}
          friend={f}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
}

function Friend({ onSelection, friend, selectedFriend }) {
  const isSelected = selectedFriend?.id === friend.id;
  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <div className="prof-info">
        <h3>{friend.name}</h3>
        {friend.balance < 0 ? (
          <p style={{ color: "red" }}>
            {" "}
            You owe {friend.name} ${-friend.balance}
          </p>
        ) : friend.balance > 0 ? (
          <p style={{ color: "green" }}>
            {friend.name} owes you ${friend.balance}
          </p>
        ) : (
          <p>You and {friend.name} are even</p>
        )}
      </div>
      <Button
        onClick={() => onSelection(friend)}
        text={isSelected ? "Close" : "Select"}
      />
    </li>
  );
}
function Button({ text, onClick }) {
  return (
    <button onClick={onClick} className="button">
      {text}
    </button>
  );
}

function AddFriend({ onAddFriends }) {
  const [friendName, setFriendName] = useState("");
  const [imageUrl, setImageUrl] = useState("https://i.pravatar.cc/48");

  function handleAddFriendSubmit(e) {
    e.preventDefault();
    if (!friendName || !imageUrl) return;
    const id = Date.now();
    const newFriend = {
      id,
      name: friendName,
      image: `${imageUrl}?=${id}`,
      balance: 0,
    };

    onAddFriends(newFriend);
    setFriendName("");
    setImageUrl("https://i.pravatar.cc/48");
  }
  return (
    <form className="form-add-friend" onSubmit={handleAddFriendSubmit}>
      <label>👯 Friend Name</label>
      <input
        type="text"
        value={friendName}
        onChange={(e) => setFriendName(e.target.value)}
      />
      <label>🌇 Image URL</label>
      <input
        type="text"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
      />
      <Button text="Add" />
    </form>
  );
}
function MainForm({ selectedFriend, onSplitBill }) {
  const [bill, setBill] = useState("");
  const [myExpense, setMyExpense] = useState("");
  const [billPayer, setBillPayer] = useState("User");

  function handleSubmit(e){
    e.preventDefault();
    if(!bill || !myExpense) return;
    if(billPayer === 'User'){
      const amountOwed = bill - myExpense;
      onSplitBill(amountOwed);
    }
    else{
      console.log("FF");
      const amountOwed = -myExpense;
      onSplitBill(amountOwed);
    }
  }
  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with {selectedFriend.name}</h2>
      <label>💰Bill Value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) =>
          setBill(isNaN(Number(e.target.value)) ? bill : Number(e.target.value))
        }
      />
      <label>🧑Your Expense</label>
      <input
        type="text"
        value={myExpense}
        onChange={(e) =>
          setMyExpense(
            isNaN(Number(e.target.value)) ? myExpense : Number(e.target.value) > bill ? myExpense : Number(e.target.value)
          )
        }
      />
      <label>🧑{selectedFriend.name}'s Expense</label>
      <input
        type="text"
        disabled
        value={myExpense && bill ? bill - myExpense : ""}
      />
      <label>💰Who is paying the bill?</label>
      <select value={billPayer} onChange={(e) => setBillPayer(e.target.value)}>
        <option value="User">You</option>
        <option value="Friend">{selectedFriend.name}</option>
      </select>
      <Button onClick={handleSubmit} text="Split Bill" />
    </form>
  );
}
