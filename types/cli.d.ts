declare type CliOptions = {
  exclude?: string[];
  include?: string[];
  node: string;
  watch?: boolean;
  webpackConfig?: string;
};

declare type CliBuildArgs = CliOptions & {
  entry: string;
  target?: string;
};

declare type CliServeArgs = CliOptions & {
  entry: string;
  basePath: string;
  port: number;
};
