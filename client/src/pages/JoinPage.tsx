import InputText from "@/components/common/Input";
import { DEFAULT_IMAGE } from "@/components/common/ProfileCard";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import { JoinProps, useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";

import icons from "@/icons/icons";
import Title from "@/components/common/Title";
import { Button } from "@/components/common/Button";
import { emailOptions, nicknameOptions, passwordOptions } from "@/config/registerOptions";

export const placeholderHander = (text: string) => {
  return `${text} 입력해주세요.`;
};
export interface joinFormProps extends JoinProps {
  passwordConfirm: string;
}
export const allowedDomains = ["naver.com", "github.com", "yahoo.com", "daum.net", "kakao.com"];

const JoinPage = () => {
  const { userJoin } = useAuth();
  const UserIcon = icons.MobileUserIcon;
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<joinFormProps>();

  const onSubmit = (data: joinFormProps) => {
    const [, domain] = data.email.split("@");
    if (!allowedDomains.includes(domain)) {
      setError("email", { message: "허용되지 않는 이메일 도메인입니다." }, { shouldFocus: true });
    }

    // 비밀번호 대조
    if (data.password !== data.passwordConfirm) {
      setError("passwordConfirm", { message: "비밀번호가 일치 하지 않습니다." }, { shouldFocus: true });
    }
    userJoin(data);
  };
  return (
    <WrapperStyle>
      <JoinPageStyle>
        <Title size="large">회원가입</Title>
        <form onSubmit={handleSubmit(onSubmit)}>
          <fieldset className="input-section">
            <InputText
              placeholder={placeholderHander("이메일")}
              inputType="email"
              {...register("email", emailOptions)}
              isButton={true}
            />
            {errors.email && <small className="error-text">{errors.email.message}</small>}
          </fieldset>
          <fieldset className="input-section">
            <InputText
              placeholder={placeholderHander("닉네임")}
              inputType="text"
              {...register("nickname", nicknameOptions)}
              isButton={true}
            />
            {errors.nickname && <small className="error-text">{errors.nickname.message}</small>}
          </fieldset>
          <fieldset className="input-section">
            <InputText
              placeholder={placeholderHander("비밀번호")}
              inputType="password"
              $inputsize="large"
              {...register("password", passwordOptions)}
            />
            {errors.password && <small className="error-text">{errors.password.message}</small>}
          </fieldset>
          <fieldset className="input-section">
            <InputText
              placeholder={placeholderHander("비밀번호 확인")}
              inputType="password"
              $inputsize="large"
              {...register("passwordConfirm", passwordOptions)}
            />
            {errors.passwordConfirm && <small className="error-text">{errors.passwordConfirm.message}.</small>}
          </fieldset>
          <fieldset className="input-section">
            <Button $scheme="primary" $radius="default" $size={"large"}>
              회원가입
            </Button>
          </fieldset>

          <div className="login-info">
            <div className="join-login">
              <span>가입되어 있으신가요?</span>
              <div className="login-link">
                <UserIcon />
                <Link to="/login">로그인하러 가기</Link>
              </div>
            </div>
            <div className="social-login">
              <div className="hr-sect">
                <div className="hr-line"></div>
                <span>간편 로그인</span>
                <div className="hr-line"></div>
              </div>
              <div className="social-icon">
                <div className="iconImge"></div>
                <div className="iconImge"></div>
              </div>
            </div>
          </div>
        </form>
      </JoinPageStyle>
    </WrapperStyle>
  );
};

export const WrapperStyle = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const JoinPageStyle = styled.div`
  width: 28.28rem;
  height: auto;
  border: 1px solid ${({ theme }) => theme.color.borderGray};
  box-shadow: 1px 1px 1px 1px ${({ theme }) => theme.color.borderGray};
  border-radius: ${({ theme }) => theme.borderRadius.default};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  form {
    margin-top: 10px;
  }

  .login-info {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 100%;
    font-size: ${({ theme }) => theme.fontSize.xsmall};
    padding: 1rem;
  }

  .login-link > :first-child {
    margin-right: 5px;
  }

  .login-link > :nth-child(2),
  .ps-link > :nth-child(1) {
    text-decoration-line: none;
    color: ${({ theme }) => theme.color.primary};
  }

  .join-login,
  .reset-ps {
    display: flex;
    width: 100%;
    text-align: center;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 5px;
    color: ${({ theme }) => theme.color.commentGray};
  }
  .join-login > :nth-child(2) {
    color: ${({ theme }) => theme.color.black};
  }

  .reset-ps {
    margin-bottom: 10px;
  }
  .error-text {
    padding-left: 1rem;
    color: ${({ theme }) => theme.color.red};
  }

  .hr-sect {
    display: flex;
    gap: 1rem;
    align-items: center;
    width: 300px;
    height: 20px;
  }
  .hr-sect > span {
    font-size: ${({ theme }) => theme.fontSize.xsmall};
    color: ${({ theme }) => theme.color.primary};
    /* white-space: nowrap; */
    height: 20px;
    width: 100px;
    text-align: center;
  }
  .hr-line {
    height: 1px;
    width: 100px;
    background: ${({ theme }) => theme.color.borderGray};
  }
  .input-section {
    border: 0;
    display: flex;

    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    gap: 15px;
    margin: 0;

    > button {
      display: flex;
      width: 100%;
      justify-content: center;
      flex: 1;
    }
  }

  .social-icon {
    margin: 15px 0;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
  }

  .iconImge {
    background-image: url(${DEFAULT_IMAGE});
    width: 2.5rem;
    height: 2.5rem;
    background-size: 100% 80%;
    background-position: center;
    border: 1px solid ${({ theme }) => theme.color.borderGray};
    border-radius: 50%;
  }
`;

export default JoinPage;
