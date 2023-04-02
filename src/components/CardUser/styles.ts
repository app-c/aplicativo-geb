import styled from 'styled-components/native';
import theme from '../../global/styles/theme';
import { t, w } from '../../utils/size';

type color = 'w' | 'ins' | 'web';

interface Props {
   bg: color;
}

const variant = {
   w: '#0c721d',
   ins: '#307098',
   web: '#15406a',
};

export const Container = styled.View`
   width: 100%;
   padding: 10px;

   background-color: ${theme.colors.focus};
   flex-direction: row;

   margin-bottom: 35px;
`;

export const title = styled.Text`
   font-size: ${t + 18}px;
   font-weight: 600;
`;

export const avatar = styled.View`
   width: ${w * 0.3}px;
   height: ${w * 0.3}px;

   border-radius: 5px;

   background-color: ${theme.colors.primary[2]};
`;

export const content = styled.View`
   flex-direction: row;
`;

export const icoLogo = styled.View`
   width: ${w * 0.18}px;
   height: ${w * 0.18}px;
   border-radius: 999px;
   position: absolute;

   align-items: center;
   justify-content: center;

   top: ${w * 0.19}px;

   background-color: ${theme.colors.primary[1]};
`;

export const subTitle = styled.Text``;

export const box = styled.View`
   padding: 4px;
   padding-left: ${w * 0.07}px;
`;

export const row = styled.View`
   flex-direction: row;
   align-items: center;
   justify-content: space-between;
   margin-top: ${w * 0.06}px;
`;

export const boxIco = styled.TouchableOpacity<Props>`
   padding: 3px 8px;
   background-color: ${h => variant[h.bg]};
   border-radius: 4px;
   width: ${w * 0.15}px;
   align-items: center;
   justify-content: center;
`;
