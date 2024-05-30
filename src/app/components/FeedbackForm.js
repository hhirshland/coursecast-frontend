"use client";
import { useState, useEffect } from "react";
import styles from "../page.module.css";

const FeedbackForm = ({ groupId }) => {
  const [isRadioSelected, setIsRadioSelected] = useState(false);

  useEffect(() => {
    const radioButtons = document.querySelectorAll(
      'input[name="satisfaction"]'
    );
    const handleRadioChange = () => {
      setIsRadioSelected([...radioButtons].some((radio) => radio.checked));
    };

    radioButtons.forEach((radio) =>
      radio.addEventListener("change", handleRadioChange)
    );

    // Cleanup event listeners on component unmount
    return () => {
      radioButtons.forEach((radio) =>
        radio.removeEventListener("change", handleRadioChange)
      );
    };
  }, []);

  return (
    <div className={styles.feedbackForm}>
      <h2>Help us improve</h2>
      <form action="https://submit-form.com/7NT2goH4c">
        <div>
          <p>Please rate your beta experience:</p>
        </div>
        <input
          type="hidden"
          name="_redirect"
          value={`https://coursecast-frontend.vercel.app/gallery?group_id=${groupId}`}
        />
        <div className={styles.stars}>
          <div>
            <input
              type="radio"
              id="love"
              name="satisfaction"
              value="love"
              required=""
            />
            <label htmlFor="love">😍</label>
          </div>
          <div>
            <input
              type="radio"
              id="happy"
              name="satisfaction"
              value="happy"
              required=""
            />
            <label htmlFor="happy">😃</label>
          </div>
          <div>
            <input
              type="radio"
              id="neutral"
              name="satisfaction"
              value="neutral"
              required=""
            />
            <label htmlFor="neutral">😐</label>
          </div>
          <div>
            <input
              type="radio"
              id="unhappy"
              name="satisfaction"
              value="unhappy"
              required=""
            />
            <label htmlFor="unhappy">😔</label>
          </div>
        </div>
        <input type="hidden" name="groupId" value={groupId} />
        <div>
          <input
            type="text"
            id="more-info"
            name="more-info"
            placeholder="How can we do better? (optional)"
            required=""
          />
        </div>

        <button type="submit" disabled={!isRadioSelected}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default FeedbackForm;
