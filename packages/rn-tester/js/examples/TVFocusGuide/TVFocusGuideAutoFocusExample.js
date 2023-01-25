/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @flow
 */

'use strict';

const React = require('react');
const ReactNative = require('react-native');

import {useRNTesterTheme} from '../../components/RNTesterTheme';

const {
  View,
  StyleSheet,
  Pressable,
  Text: RNText,
  TVFocusGuideView,
  FlatList,
  ScrollView,
} = ReactNative;

exports.framework = 'React';
exports.title = 'TVFocusGuide autoFocus example';
exports.description = 'Focus guide autoFocus usage';
exports.displayName = 'TVFocusGuideAutoFocusExample';
exports.examples = [
  {
    title: 'TVFocusGuideAutoFocusExample',
    render(): React.Node {
      return <TVFocusGuideAutoFocusExample />;
    },
  },
];

// Set it to false to see the behavior without TVFocusGuide.
const FOCUS_GUIDE_ENABLED = true;
const FOCUSABLE_ITEM_COLOR = '#197BBD';
const FOCUS_BORDER_COLOR = '#D1CAA1';

const screenHeight = ReactNative.Dimensions.get('window').height;
const scale = screenHeight / 1080;

const generateData = (length = 10) => {
  return Array.from({length}).map((item, index) => index);
  // return Array.from({length: length + Math.floor(Math.random() * 10)}).map(
  //   (item, index) => Math.floor(Math.random() * 999),
  // );
};

const TVFocusGuide = ({autoFocus, destinations, ...props}) => {
  if (!FOCUS_GUIDE_ENABLED) {
    return <View {...props} />;
  }

  return (
    <TVFocusGuideView
      {...props}
      autoFocus={autoFocus}
      destinations={destinations}
    />
  );
};

const Text = ({style, children}) => {
  const theme = useRNTesterTheme();
  return (
    <RNText style={[styles.text, {color: theme.LabelColor}, style]}>
      {children}
    </RNText>
  );
};

const FocusableBox = ({
  width,
  height,
  color: backgroundColor = FOCUSABLE_ITEM_COLOR,
  text,
  ...props
}) => {
  return (
    <Pressable
      {...props}
      style={state => [
        {
          width,
          height,
          backgroundColor,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 4,
        },
        state.focused && {borderColor: FOCUS_BORDER_COLOR, borderWidth: 2},
        props.style,
      ]}>
      {text !== undefined ? (
        <RNText style={{fontSize: 24 * scale}}>{text}</RNText>
      ) : null}
    </Pressable>
  );
};

const SideMenu = () => {
  return (
    <TVFocusGuide autoFocus style={styles.sideMenuContainer}>
      <Text style={{fontSize: 18 * scale, marginBottom: 10 * scale}}>
        Side Menu
      </Text>

      <FocusableBox style={styles.sideMenuItem} />
      <FocusableBox style={styles.sideMenuItem} />
      <FocusableBox style={styles.sideMenuItem} />
      <FocusableBox style={styles.sideMenuItem} />
      <FocusableBox style={styles.sideMenuItem} />
    </TVFocusGuide>
  );
};

const getItemText = ({item, prefix}) => {
  return prefix ? `${prefix}-${item}` : `${item}`;
};

const HList = ({
  itemCount,
  itemWidth = 500 * scale,
  itemHeight = 120 * scale,
  itemColor = FOCUSABLE_ITEM_COLOR,
  onItemFocused,
  prefix = '',
  ...props
}) => {
  const listRef = React.useRef(null);

  const data = React.useMemo(() => generateData(itemCount), [itemCount]);

  const renderItem = ({item, index}) => {
    return (
      <FocusableBox
        width={itemWidth}
        height={itemHeight}
        color={itemColor}
        style={styles.mr5}
        text={getItemText({prefix, item})}
        onFocus={() => onItemFocused?.({item, index})}
      />
    );
  };

  return (
    <FlatList
      keyExtractor={item => getItemText({prefix, item})}
      ref={listRef}
      data={data}
      renderItem={renderItem}
      horizontal
      contentContainerStyle={styles.hListContainer}
      {...props}
    />
  );
};

const categoryData = [1, 2, 3, 4, 5];
const getSelectedItemPrefix = selectedCategory => {
  if (selectedCategory === null) return 'Item';
  return `Category ${selectedCategory} - Item`;
};
const Row = ({title}) => {
  const [selectedCategory, setSelectedCategory] = React.useState('1');

  const onCategoryFocused = ({item}) => {
    setSelectedCategory(item);
  };

  return (
    <View style={styles.mb5}>
      <TVFocusGuide autoFocus style={styles.rowTop}>
        <Text style={styles.rowTitle}>{title}</Text>
        <HList
          prefix="Category"
          itemCount={5}
          data={categoryData}
          itemHeight={50 * scale}
          itemWidth={200 * scale}
          onItemFocused={onCategoryFocused}
        />
      </TVFocusGuide>
      <TVFocusGuide autoFocus style={styles.mb5}>
        <HList
          prefix={getSelectedItemPrefix(selectedCategory)}
          itemCount={10}
        />
      </TVFocusGuide>
    </View>
  );
};

const Col = ({title}) => {
  return (
    <TVFocusGuide autoFocus style={styles.col}>
      <Text style={styles.rowTitle}>{title}</Text>
      <FocusableBox text="0" style={styles.colItem} />
      <FocusableBox text="1" style={styles.colItem} />
      <FocusableBox text="2" style={styles.colItem} />
      <FocusableBox text="3" style={styles.colItem} />
    </TVFocusGuide>
  );
};

const ContentArea = () => {
  return (
    <TVFocusGuide autoFocus style={{flex: 1}}>
      <ScrollView>
        <Text style={{fontSize: 48 * scale, margin: 10 * scale}}>
          Welcome to the TVFocusGuide example!
        </Text>
        <TVFocusGuide autoFocus style={styles.mb5}>
          <HList itemCount={10} />
        </TVFocusGuide>
        <Row title="Category Example 1" />
        <Row title="Category Example 2" />

        <TVFocusGuide autoFocus style={styles.cols}>
          <Col title="Genres" />
          <Col title="Sub Genres" />
          <Col title="Year" />
        </TVFocusGuide>
      </ScrollView>
    </TVFocusGuide>
  );
};

const TVFocusGuideAutoFocusExample = () => {
  const theme = useRNTesterTheme();

  return (
    <View style={[styles.container, {backgroundColor: theme.BackgroundColor}]}>
      <SideMenu />
      <ContentArea />
    </View>
  );
};

const styles = StyleSheet.create({
  fill: {flex: 1},
  fillAndCenter: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  mb5: {marginBottom: 5 * scale},
  mr5: {marginRight: 5 * scale},
  text: {
    fontWeight: 'bold',
    fontSize: 18 * scale,
  },
  hListContainer: {paddingHorizontal: 16 * scale},
  col: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8 * scale,
  },
  rowTop: {
    flexDirection: 'row',
    marginVertical: 5 * scale,
    padding: 10 * scale,
    alignItems: 'center',
  },
  rowTitle: {marginRight: 10 * scale, fontSize: 24 * scale},
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  sideMenuContainer: {
    width: 100 * scale,
    backgroundColor: 'gray',
    alignItems: 'center',
  },
  sideMenuItem: {
    width: 80 * scale,
    height: 80 * scale,
    marginBottom: 6 * scale,
  },
  cols: {
    flexDirection: 'row',
    paddingHorizontal: 16 * scale,
  },
  colItem: {
    width: '100%',
    height: 100 * scale,
    marginBottom: 5 * scale,
  },
});
