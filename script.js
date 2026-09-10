import { createClient }
  from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const SUPABASE_URL = "https://bclcknoxyjvrqqdhoevo.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_VFxx1zL_Je9RKEvutGNZmQ_faQeMmtE";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const form = document.getElementById("messageForm");
const messagesDiv = document.getElementById("messages");

async function loadMessages() {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    messagesDiv.textContent = "Could not load messages.";
    return;
  }

  messagesDiv.innerHTML = "";

  for (const message of data) {
    const div = document.createElement("div");
    div.className = "message";

    div.innerHTML = `
      <div class="username"></div>
      <div class="text"></div>
      <div class="date"></div>
    `;

    div.querySelector(".username").textContent = message.username;
    div.querySelector(".text").textContent = message.message;
    div.querySelector(".date").textContent =
      new Date(message.created_at).toLocaleString();

    messagesDiv.appendChild(div);
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const username = document.getElementById("username").value.trim();
  const message = document.getElementById("message").value.trim();

  if (!username || !message) return;

  const { error } = await supabase
    .from("messages")
    .insert({
      username: username,
      message: message
    });

  if (error) {
    console.error(error);
    alert("Could not post message.");
    return;
  }

  document.getElementById("message").value = "";

  await loadMessages();
});

loadMessages();


