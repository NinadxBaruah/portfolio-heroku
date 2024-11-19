
let users;
let user_id_to_update;
const container = document.getElementById("userCards");
function getUserData() {}

function formatDate(seconds) {
  return new Date(seconds * 1000).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

async function createUserCards() {
  try {
    const response = await fetch(`https://ninadbaruah.me/projects/intern/2/api/v1/users`); 

    if (response.ok) {
      users = await response.json();
      // Sort users by `createdAt.seconds`
      users.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);
      console.log(users)
      users.forEach((user) => {
        const card = document.createElement("div");
        card.className = "card";
        card.id = user.id;
        card.innerHTML = `
                <div class="card-header">
                    <div class="name">${user.name}</div>
                    <div class="email">${user.email}</div>
                </div>
                <div class="card-body">
                    <div class="stats">
                        <div class="stat">
                            <div class="stat-label">Age</div>
                            <div class="stat-value">${user.age}</div>
                        </div>
                        <div class="stat">
                            <div class="stat-label">Weight</div>
                            <div class="stat-value">${user.weight}kg</div>
                        </div>
                        <div class="stat">
                            <div class="stat-label">Height</div>
                            <div class="stat-value">${user.height}cm</div>
                        </div>
                    </div>
                    <div class="goals">
                        <div class="goals-label">Health Goals</div>
                        <div class="goals-text">${user.healthGoals}</div>
                    </div>
                    <div class="created-date">
                        Created: ${formatDate(user.createdAt.seconds)}
                    </div>
                </div>
                <div class="card-footer">
                     <button class="btn btn-edit" onclick='editUser(${JSON.stringify(
                       user
                     )})'>Edit</button>
                    <button class="btn btn-delete" onclick="deleteUser('${
                      user.id
                    }')">Delete</button>
                </div>
            `;
        container.appendChild(card);
      });
    }
  } catch (error) {
    console.log(error);
  }
}

function updateUserCards(userId){
  const targetCard = users.filter((user) =>{
    return user.id != userId;
  })

  users = targetCard;
  document.getElementById("userCards").innerHTML = "";
  users.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);

  users.forEach((user) => {
    const card = document.createElement("div");
    card.className = "card";
    card.id = user.id;
    card.innerHTML = `
            <div class="card-header">
                <div class="name">${user.name}</div>
                <div class="email">${user.email}</div>
            </div>
            <div class="card-body">
                <div class="stats">
                    <div class="stat">
                        <div class="stat-label">Age</div>
                        <div class="stat-value">${user.age}</div>
                    </div>
                    <div class="stat">
                        <div class="stat-label">Weight</div>
                        <div class="stat-value">${user.weight}kg</div>
                    </div>
                    <div class="stat">
                        <div class="stat-label">Height</div>
                        <div class="stat-value">${user.height}cm</div>
                    </div>
                </div>
                <div class="goals">
                    <div class="goals-label">Health Goals</div>
                    <div class="goals-text">${user.healthGoals}</div>
                </div>
                <div class="created-date">
                    Created: ${formatDate(user.createdAt.seconds)}
                </div>
            </div>
            <div class="card-footer">
                 <button class="btn btn-edit" onclick='editUser(${JSON.stringify(
                   user
                 )})'>Edit</button>
                <button class="btn btn-delete" onclick="deleteUser('${
                  user.id
                }')">Delete</button>
            </div>
        `;
    container.appendChild(card);
  });
}

async function deleteUser(userId) {
  const confirmed = confirm("Are you sure you want to delete this user?");
  if (confirmed) {
    alert(`User with ID: ${userId} deleted`);

    try {
      const response = await fetch(`https://ninadbaruah.me/projects/intern/2/api/v1/users/${userId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        // Add logic to remove the user from the database and the DOM
        // const card = document.querySelector(`[data-id="${userId}"]`);
        // if (card) card.remove();
        // document.getElementById("userCards").innerHTML = "";
        // createUserCards();
        updateUserCards(userId);
      }
    } catch (error) {
      console.log(error);
    }
  }
}

createUserCards();

const createUserButton = document.querySelector(".create-user");
const close_button = document.querySelector(".close");
const form_container = document.querySelector(".form-container");
const loader = document.querySelector(".loader");

createUserButton.addEventListener("click", () => {
  form_container.style.display = "block";
  createUserButton.style.display = "none";
});

close_button.addEventListener("click", () => {
  form_container.style.display = "none";
  createUserButton.style.display = "inline-block";
});

// On form submit
const form_submit = document.querySelector(".form-submit");

form_submit.addEventListener("submit", async (e) => {
  loader.style.display = "block";
  e.preventDefault();

  try {
    const response = await fetch(`https://ninadbaruah.me/projects/intern/2/api/v1/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: document.querySelector("#name").value,
        email: document.querySelector("#email").value,
        age: document.querySelector("#age").value,
        weight: document.querySelector("#weight").value,
        height: document.querySelector("#height").value,
        healthGoals: document.querySelector("#healthGoals").value,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("User successfully created:", data);


    // document.getElementById("userCards").innerHTML = "";
    const newUserDetails ={
      id:data.id,
      name: document.querySelector("#name").value,
      email: document.querySelector("#email").value,
      age: document.querySelector("#age").value,
      weight: document.querySelector("#weight").value,
      height: document.querySelector("#height").value,
      healthGoals: document.querySelector("#healthGoals").value,
    }
    insterNewCard(newUserDetails);

    document.querySelector("#name").value = "";
    document.querySelector("#email").value = "";
    document.querySelector("#age").value = "";
    document.querySelector("#weight").value = "";
    document.querySelector("#height").value = "";
    document.querySelector("#healthGoals").value = "";
    loader.style.display = "none";
    createUserButton.style.display = "inline-block";
    form_container.style.display = "none";
  } catch (error) {
    console.error("Error submitting form:", error.message);
  }
});


function insterNewCard (newUserDetails) {
  console.log(newUserDetails);
  const card = document.createElement("div");
  card.className = "card";
  card.id = newUserDetails.id;
  card.innerHTML = `
          <div class="card-header">
              <div class="name">${newUserDetails.name}</div>
              <div class="email">${newUserDetails.email}</div>
          </div>
          <div class="card-body">
              <div class="stats">
                  <div class="stat">
                      <div class="stat-label">Age</div>
                      <div class="stat-value">${newUserDetails.age}</div>
                  </div>
                  <div class="stat">
                      <div class="stat-label">Weight</div>
                      <div class="stat-value">${newUserDetails.weight}kg</div>
                  </div>
                  <div class="stat">
                      <div class="stat-label">Height</div>
                      <div class="stat-value">${newUserDetails.height}cm</div>
                  </div>
              </div>
              <div class="goals">
                  <div class="goals-label">Health Goals</div>
                  <div class="goals-text">${newUserDetails.healthGoals}</div>
              </div>
              <div class="created-date">
                  Created: ${formatDate(Math.floor(new Date().getTime() / 1000))}
              </div>
          </div>
          <div class="card-footer">
               <button class="btn btn-edit" onclick='editUser(${JSON.stringify(
                newUserDetails
               )})'>Edit</button>
              <button class="btn btn-delete" onclick="deleteUser('${
                newUserDetails.id
              }')">Delete</button>
          </div>
      `;
    container.insertBefore(card , container.firstChild);
}


const update_form_container = document.querySelector(".update-form-container");
const update_form_submit = document.querySelector(".update-form-submit"); 

document.querySelector(".update-form-close").addEventListener("click" , () =>{
    update_form_container.style.display = "none";
    document.querySelector("#update-name").value = "";
    document.querySelector("#update-email").value = "";
    document.querySelector("#update-age").value = "";
    document.querySelector("#update-weight").value = "";
    document.querySelector("#update-height").value = "";
    document.querySelector("#update-healthGoals").value = "";
})

function editUser(click_user) {

   
    update_form_container.style.display = "block";

    user_id_to_update = click_user.id.toString();
    // Populate form fields or handle user data
    document.querySelector("#update-name").value = click_user.name;
    document.querySelector("#update-email").value = click_user.email;
    document.querySelector("#update-age").value = click_user.age;
    document.querySelector("#update-weight").value = click_user.weight;
    document.querySelector("#update-height").value = click_user.height;
    document.querySelector("#update-healthGoals").value = click_user.healthGoals;

  console.log(click_user);
};



update_form_submit.addEventListener("submit" , async (e) =>{
  e.preventDefault();
  const update_name = document.querySelector("#update-name").value
  const update_email = document.querySelector("#update-email").value
  const update_age = document.querySelector("#update-age").value
  const update_weight = document.querySelector("#update-weight").value
  const update_height = document.querySelector("#update-height").value
  const update_healthGoals = document.querySelector("#update-healthGoals").value
  
  try {
    const response = await fetch(`https://ninadbaruah.me/projects/intern/2/api/v1/users/${user_id_to_update}`,{
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: update_name,
            email: update_email,
            age: update_age,
            weight: update_weight,
            height: update_height,
            healthGoals: update_healthGoals
            })
    });

    if(response.ok){
        const data = await response.json();
        console.log(data);

        document.querySelector("#update-name").value = "";
        document.querySelector("#update-email").value = "";
        document.querySelector("#update-age").value = "";
        document.querySelector("#update-weight").value = "";
        document.querySelector("#update-height").value = "";
        document.querySelector("#update-healthGoals").value = "";
        update_form_container.style.display = "none";
        document.getElementById("userCards").innerHTML = "";
        createUserCards();
    }
  } catch (error) {
    console.log(error);
  }

})