import styled,{css} from 'styled-components';
const columnVerticalCenter = css`
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
`;
export const AttendanceStyled = styled.div`
    height: ${ window.screen.height - 113}px;
    ${ columnVerticalCenter }
    .box {
        width: 1.92rem;
        height: 1.92rem;
        border-radius: 50%;
        background-color: #3c4f9b;
        ${ columnVerticalCenter }
    }
`;