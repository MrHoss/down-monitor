import { useState } from "react";
import "./App.css";
import useWebsite from "./hooks/useWebsites";

const App = (): JSX.Element => {
  const [formData, setFormData] = useState<{ name: string; address: string }>({ name: "", address: "" });
  const { websiteList, time, addWebsite, deleteWebsite } = useWebsite();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleAddWebsite = (): void => {
    addWebsite(formData.name, formData.address);
    setFormData({ name: "", address: "" });
  };

  return (
    <div className="container">
      <h1>Down Monitor</h1>
      <p>{time.toLocaleString()}</p>
      <p>Add your website address</p>
      <p>{!window.__TAURI__ && "Please note that website status checking may not work properly when accessing the app via a browser due to Cross-Origin Resource Sharing (CORS) restrictions. For accurate results, consider using the app in a native environment."}</p>
      <form
        className="row"
        onSubmit={(e) => {
          e.preventDefault();
          handleAddWebsite();
        }}
      >
        <input
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Name"
        />
        <input
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          placeholder="Address"
        />
        <button type="submit">Add</button>
      </form>
      <hr style={{ width: "100%" }} />
      <div className="row" style={{ margin: 7, width: "100%" }}>
        <table style={{ width: "100%" }}>
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Address</th>
              <th scope="col">Status</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {websiteList.map((website, index) => (
              <tr key={index}>
                <th scope="row">{website.name}</th>
                <td>{website.address}</td>
                <td>{website.status || "loading"}</td>
                <td>
                  <button onClick={() => deleteWebsite(index)}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
