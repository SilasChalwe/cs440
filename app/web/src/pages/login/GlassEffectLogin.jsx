import { useEffect } from "react";
import { Button } from "../../Button/Button";
import { TextField } from "../../TextField/TextField";
import logo from "../../assets/react.svg";
import group2 from "./group-2.png";
import group3 from "./group-3.png";
import group4 from "./group-4.png";
import group5 from "./group-5.png";
import group6 from "./group-6.png";
import group7 from "./group-7.png";
import group8 from "./group-8.png";
import group9 from "./group-9.png";
import group10 from "./group-10.png";
import group11 from "./group-11.png";
import group12 from "./group-12.png";
import group from "./group.png";
import image from "./image.png";
import "./style.css";

export const GlassEffectLogin = ({
  loading = false,
  timedOut = false,
  errorMessage = "",
  username = "",
  password = "",
  canSubmit = false,
  onSubmit = (event) => event.preventDefault(),
  onUsernameChange = (event) => {},
  onPasswordChange = (event) => {},
}) => {
  useEffect(() => {
    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, []);

  return (
    <div className="glass-effect-login">
      <div className="div">
        <img className="group" alt="Group" src={group10} />

        <img className="img" alt="Group" src={group12} />

        <div className="overlap">
          <img className="group-2" alt="Group" src={group4} />

          <div className="div-2">
            <div className="overlap-group">
              <div className="overlap-group-2">
                <img className="group-3" alt="Group" src={group8} />

                <img className="group-4" alt="Group" src={group11} />

                <img className="group-5" alt="Group" src={group3} />

                <form className="frame" onSubmit={onSubmit} noValidate>
                  <img className="login-logo" alt="App logo" src={logo} />

                  <div className="frame-2">
                    <div className="text-wrapper-2">Login</div>

                    {timedOut ? (
                      <div className="login-alert login-warning" role="status">
                        Session timed out. Please sign in again.
                      </div>
                    ) : null}

                    {errorMessage ? (
                      <div className="login-alert login-error" role="alert">
                        {errorMessage}
                      </div>
                    ) : null}

                    <div className="auto-flex-wrapper">
                      <div className="auto-flex">
                        <div className="frame-3">
                          <label
                            className="text-wrapper-3"
                            htmlFor="login-username"
                          >
                            Email
                          </label>

                          <div className="div-wrapper">
                            <input
                              id="login-username"
                              className="login-input"
                              type="text"
                              name="username"
                              autoComplete="username"
                              placeholder="username@gmail.com"
                              value={username}
                              onChange={onUsernameChange}
                              disabled={loading}
                            />
                          </div>
                        </div>

                        <div className="frame-4">
                          <label
                            className="text-wrapper-3"
                            htmlFor="login-password"
                          >
                            Password
                          </label>

                          <TextField
                            id="login-password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={onPasswordChange}
                            disabled={loading}
                          />
                        </div>

                        <button className="text-wrapper-5 button-link" type="button">
                          Forgot Password?
                        </button>
                      </div>
                    </div>

                    <Button
                      color="primary"
                      size="medium"
                      type="submit"
                      disabled={loading || !canSubmit}
                    >
                      {loading ? "Signing in..." : "Sign in"}
                    </Button>
                    <div className="form-spacer" />
                  </div>
                </form>

                <img className="group-6" alt="Group" src={group6} />

                <img className="group-7" alt="Group" src={group} />

                <img className="group-8" alt="Group" src={group7} />
              </div>

              <img className="group-9" alt="Group" src={image} />

              <img className="group-10" alt="Group" src={group9} />

              <img className="group-11" alt="Group" src={group5} />
            </div>

            <img className="group-12" alt="Group" src={group2} />
          </div>
        </div>
      </div>
    </div>
  );
};
