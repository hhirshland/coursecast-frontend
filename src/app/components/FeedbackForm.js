"use client";
import styles from "../page.module.css";

const FeedbackForm = ({ groupId }) => {
  return (
    <div className={styles.feedbackForm}>
      <h2>Help us improve!</h2>
      <form action="https://submit-form.com/7NT2goH4c">
        <div>Rate your video!</div>
        <input
          type="hidden"
          name="_redirect"
          value={`https://coursecast-frontend.vercel.app/gallery?group_id=${groupId}`}
        />
        <div>
          <input
            type="radio"
            id="love"
            name="satisfaction"
            value="love"
            required=""
          />
          <label for="love">😍</label>
        </div>
        <div>
          <input
            type="radio"
            id="happy"
            name="satisfaction"
            value="happy"
            required=""
          />
          <label for="happy">😃</label>
        </div>
        <div>
          <input
            type="radio"
            id="neutral"
            name="satisfaction"
            value="neutral"
            required=""
          />
          <label for="neutral">😐</label>
        </div>
        <div>
          <input
            type="radio"
            id="unhappy"
            name="satisfaction"
            value="unhappy"
            required=""
          />
          <label for="unhappy">😔</label>
        </div>
        <input type="hidden" name="groupId" value={groupId} />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default FeedbackForm;
