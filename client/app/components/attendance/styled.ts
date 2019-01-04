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
        width: 100%;
        height: ${ window.screen.height - 100}px;
        border-radius: 50%;
        background-color: #3c4f9b;
        .icon2{
            position: absolute;
            z-index: 2;
                left: 1.92rem;
            }
        .icon {
            position: absolute;
            z-index: 2;
            
        }
        canvas {
            position: absolute;
            z-index: 1;
        }
    }
`;